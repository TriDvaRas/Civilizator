import { CommandInteraction, MessageEmbed } from "discord.js";
import { randInt } from "../util/random";

export default {
    name: 'roll',
    execute: async (interaction: CommandInteraction) => {
        let min = interaction.options.getInteger(`min`, false) || 0
        let max = interaction.options.getInteger(`max`, false) || 100
        const amount = interaction.options.getInteger(`amount`, false) || 1
        if (amount < 1 || amount > 100)
            return interaction.reply({ content: `Amount value should be in range 1-100`, ephemeral: true })
        if (min > max)
            [min, max] = [max, min]
        const numbers = (new Array(amount).fill(0)).map(() => `${randInt(min, max+1)}`)
        
        const embed = new MessageEmbed()
            .setTitle(`**${amount}** number${amount > 1 ? `s` : ``} in range **${min}** - **${max}**:`)
            .setDescription(`${numbers.join(` \t`)}\u200B`)
            .setColor(`RANDOM`)
        interaction.reply({ embeds: [embed] })
    }
}