import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";

export default {
    name: 'ping',
    execute: async (interaction: CommandInteraction) => {
        let ping = Date.now() - interaction.createdTimestamp
        let color: ColorResolvable = `GREEN`
        if (ping > 300) color = `RED`
        else if (ping > 250) color = `ORANGE`
        else if (ping > 200) color = `YELLOW`
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .addField(`Pong in`, `${ping}ms`)
                    .setColor(color)
            ]
        })
    }
}