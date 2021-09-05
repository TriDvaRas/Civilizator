import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getGameSetButtons, getSettingsButtons } from "../managers/buttonManager";
import { createGameSetEmbed, createSettingsEmbed } from "../managers/embedManager";
import { IFullGame, IGuild } from "../types/api";
import { IGuildUpdateArgs } from "../types/apiReqs";

export default {
    customId: 'settings-reroll-add',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const guildConfig = await api.get(`/guild/${interaction.guild?.id}`) as IGuild
        if (args[0] === undefined || isNaN(Number(args[0]))) {
            log.warn(`Invalid button data: ${interaction.customId} | [${args.join(`, `)}]`)
            return await interaction.reply({ content: `Unknown error occurred while processing button interaction...`, ephemeral: true })
        }
        let newValue = guildConfig.rerollThreshold + Number(args[0])
        if (newValue < 5)
            newValue = 5
        else if (newValue > 100)
            newValue = 100
        const newGuildConfig = await api.patch(`/guild/${interaction.guild?.id}`, {
            rerollThreshold: newValue
        } as IGuildUpdateArgs) as IGuild
        await interaction.update({ embeds: [createSettingsEmbed(newGuildConfig, 'reroll')], components: getSettingsButtons(newGuildConfig, 'reroll') })
    }
}