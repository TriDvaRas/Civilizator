import { ColorResolvable, MessageEmbed, TextChannel } from "discord.js";
import winston from "winston";
import { toKeyValue } from "./objects";

export async function sendLog(msg: winston.Logform.TransformableInfo) {
    const logChannel = await client.channels.fetch(process.env.FULLLOG_CHANNEL_ID as string) as TextChannel
    if (!logChannel)
        return
    try {
        await logChannel.send({ embeds: [formatLog(msg)] })
        if (['error', 'warn'].includes(msg.level))
            await (await client.channels.fetch(process.env.ERRORLOG_CHANNEL_ID as string) as TextChannel)?.send({ content: msg.level === `error` && !process.env.DEV ? `<@${process.env.BOT_OWNER_ID}>` : undefined, embeds: [formatLog(msg)] })
    } catch (error) {
        //! do not use winston here as it loops 
        console.log(error);
    }
}

function formatLog(msg: winston.Logform.TransformableInfo) {
    const embed = new MessageEmbed()
        .setTitle(`${msg.level.toUpperCase()}\u200B`)
        .setTimestamp()
        .setColor(levelToColor(msg.level))
    if (!msg.message) {
        //@ts-ignore
        msg.message = { ...msg }
        //@ts-ignore
        delete msg.message.level
        //@ts-ignore
        delete msg.message.timestamp
    }
    if (typeof msg.message === 'object')
        embed.addFields(toKeyValue(msg.message).map(x => ({
            name: `${x.key}\u200B`,
            value: `${x.value}\u200B`,
            inline: [`cmd`, `btn`].includes(msg.level),
        })))
    else if (typeof msg.message === 'string')
        embed.setDescription(msg.message)
    else
        log.warn(`Unknown log message type: ${typeof msg.message}`);


    return embed
}

function levelToColor(level: string): ColorResolvable {
    switch (level) {
        case 'error':
            return 'RED'
        case 'warn':
            return 'YELLOW'
        case 'cmd':
            return '#E82578'
        case 'btn':
            return '#AAE825'
        case 'debug':
            return 'DARK_AQUA'
        case 'info':
            return 'GREEN'
        default:
            log.warn(`No color set for level \`${level}\``)
            return 'LUMINOUS_VIVID_PINK'
    }
}