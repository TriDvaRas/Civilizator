import { Message, MessageEmbed, MessagePayload, TextChannel, ThreadChannel } from "discord.js";
import api from "../api/api";
import commandsPermData from "../data/commandsPermData";
import commandsRegData from "../data/commandsRegData";
import commandsData from "../data/commandsRegData";
import stringsConfig from "../data/stringsConfig";
import { createBaseGameEmbed } from "../managers/embedManager";

export default async function messageHandler(message: Message): Promise<void> {
    if (message.guildId == null && message.author.id !== client.user?.id) {
        const user = message.author
        const logChannel = await client.channels.fetch(process.env.FEED_CHANNEL_ID as string) as TextChannel
        let feed = await api.get(`/feed/${user.id}`)
        let thread
        if (!feed) {
            thread = await (await logChannel.send({
                embeds: [new MessageEmbed()
                    .setTitle(user.tag)
                    .setDescription(user.id)
                    .setThumbnail(user.avatarURL() || ``)
                    .setColor(`RANDOM`)
                ]
            })).startThread({
                name: `${user.tag} [${user.id}] Feed`,
                autoArchiveDuration: 1440,
            })
            message.channel.send(`Hi! Your first message was submited\nTIL: This message is one time only. To see if message was submited check if bot reacted to it with 👌`)
            feed = await api.post(`/feed`, { userId: user.id, threadMessageId: thread.id, dmId: message.channelId })
        }
        else {
            thread = (await logChannel.messages.fetch(feed.threadMessageId)).thread as ThreadChannel
        }
        await thread.send({ content: `${message.content}\u200B`, files: message.attachments.map(x => x.attachment), embeds: message.embeds })
        message.react(`👌`)
    }
    if (message.content.toLowerCase() === '!d' && message.author.id === process.env.BOT_OWNER_ID) {
        const regData = commandsRegData.regcommand
        const command = await message.guild?.commands.create(regData);
        const permData = commandsPermData.regcommand
        const perm = await command?.permissions.set({ permissions: permData })
        message.reply(`Registered regcommand`)
    }
}