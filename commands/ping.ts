import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";

export default {
    name: 'ping',
    execute: async (interaction: CommandInteraction) => {
        const pingTime = Date.now()
        let ping = pingTime - interaction.createdTimestamp
        let color: ColorResolvable = `GREEN`
        if (ping > 300) color = `RED`
        else if (ping > 225) color = `ORANGE`
        else if (ping > 150) color = `YELLOW`
        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .addField(`Ping`, `${ping}ms`, true)
                    .setColor(color)
            ]
        })
        const pongTime = Date.now()
        let pong = pongTime - pingTime
        if (ping > 300 || pong > 300) color = `RED`
        else if (ping > 225 || pong > 225) color = `ORANGE`
        else if (ping > 150 || pong > 150) color = `YELLOW`
        interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .addField(`Ping`, `${ping}ms`, true)
                    .addField(`Pong`, `${pong}ms`, true)
                    .setColor(color)
            ]
        })

    }
}