import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getSettingsButtons } from "../managers/buttonManager";
import { createSettingsEmbed } from "../managers/embedManager";
import { IGuild } from "../types/api";
import { IGuildUpdateArgs } from "../types/apiReqs";

export default {
    customId: 'settings-reroll-default',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const newGuildConfig = await api.patch(`/guild/${interaction.guild?.id}`, {
            rerollThreshold: 70
        } as IGuildUpdateArgs) as IGuild
        await interaction.update({ embeds: [createSettingsEmbed(newGuildConfig, 'reroll')], components: getSettingsButtons(newGuildConfig, 'reroll') })
    }
}