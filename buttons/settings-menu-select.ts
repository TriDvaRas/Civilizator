import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getGameSetButtons, getSettingsButtons } from "../managers/buttonManager";
import { createGameSetEmbed, createSettingsEmbed } from "../managers/embedManager";
import { IGuild } from "../types/api";
import { GameSettingsType, GuildSettingsType } from "../types/custom";

export default {
    customId: 'settings-menu-select',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const guildConfig = await api.get(`/guild/${interaction.guild?.id}`) as IGuild

        const value = args[0] as GuildSettingsType
            await interaction.update({ embeds: [createSettingsEmbed(guildConfig, value)], components: getSettingsButtons(guildConfig, value) })
    }
}