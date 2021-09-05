import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getSettingsButtons } from "../managers/buttonManager";
import { createSettingsEmbed } from "../managers/embedManager";
import { IGuild } from "../types/api";
import { IGuildUpdateArgs } from "../types/apiReqs";
import { PermissionTypes } from "../types/custom";

export default {
    customId: 'settings-permissions-default',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        let data: IGuildUpdateArgs
        switch (args[0] as PermissionTypes) {
            case 'pu':
                data = { privilegedUsers: [] }
                break;
            case 'r':
                data = { whiteRoles: [] }
                break;
            case 'c':
                data = { whiteChannels: [] }
                break;
        }
        const newGuildConfig = await api.patch(`/guild/${interaction.guild?.id}`, data) as IGuild
        await interaction.update({ embeds: [createSettingsEmbed(newGuildConfig, `permissions`)], components: getSettingsButtons(newGuildConfig, `permissions`) })
    }
}