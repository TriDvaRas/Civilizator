import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";

export default {
    name: 'emojilist',
    execute: async (interaction: CommandInteraction) => {
        interaction.reply({
            content: `\n${interaction.guild?.emojis.cache.map(e => `<:${e.identifier}> ${e.identifier}`).join(`\n`)}\u200B`,

        })
    }
}