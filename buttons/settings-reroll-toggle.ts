import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getGameSetButtons, getSettingsButtons } from "../managers/buttonManager";
import { createGameSetEmbed, createSettingsEmbed } from "../managers/embedManager";
import { IFullGame, IGuild } from "../types/api";
import { IGuildUpdateArgs } from "../types/apiReqs";

export default {
    customId: 'settings-reroll-toggle',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const guildConfig = await api.get(`/guild/${interaction.guild?.id}`) as IGuild
        const newGuildConfig = await api.patch(`/guild/${interaction.guild?.id}`, {
            rerollThreshold: -guildConfig.rerollThreshold
        } as IGuildUpdateArgs) as IGuild
        await interaction.update({ embeds: [createSettingsEmbed(newGuildConfig, 'reroll')], components: getSettingsButtons(newGuildConfig, 'reroll') })
    }
}