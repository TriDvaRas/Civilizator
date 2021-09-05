import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getGameSetButtons, getSettingsButtons } from "../managers/buttonManager";
import { createGameSetEmbed, createSettingsEmbed } from "../managers/embedManager";
import { IFullGame, IGuild } from "../types/api";

export default {
    customId: 'settings-menu',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const guildConfig = await api.get(`/guild/${interaction.guild?.id}`) as IGuild
        
        await interaction.update({ embeds: [createSettingsEmbed(guildConfig, 'menu')], components: getSettingsButtons(guildConfig, 'menu') })
    }
}