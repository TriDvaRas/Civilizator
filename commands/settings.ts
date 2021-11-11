import { CommandInteraction, GuildMember } from "discord.js";
import api from "../api/api";
import { getGameSetButtons, getSettingsButtons } from "../managers/buttonManager";
import { createGameSetEmbed, createSettingsEmbed } from "../managers/embedManager";
import { IGuild } from "../types/api";
import { findGame } from "../util/games";
import { isMemberAdminOrPrivileged } from "../util/permissions";

export default {
    name: 'settings',
    execute: async (interaction: CommandInteraction) => {
        if (!interaction.guild)
            return await interaction.reply({ content: `This command can not be used in DM`, ephemeral: true })
        const guildConfig = await api.get(`/guild/${interaction.guild.id}`) as IGuild
        if (!isMemberAdminOrPrivileged(guildConfig, interaction.member as GuildMember))
            return await interaction.reply({ content: `This command can only be used by server admins or privileged users`, ephemeral: true })
        await interaction.reply({ embeds: [createSettingsEmbed(guildConfig, 'menu')], components: getSettingsButtons(guildConfig, 'menu'), ephemeral: true })
    }
}