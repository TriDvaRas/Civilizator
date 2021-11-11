import { CategoryChannel, ColorResolvable, CommandInteraction, GuildChannel, GuildMember, Message, MessageEmbed, NewsChannel, Snowflake, StageChannel, StoreChannel, TextChannel, VoiceChannel } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons } from "../managers/buttonManager";
import { createBaseGameEmbed, createGameEmbed } from "../managers/embedManager";
import { newGame } from "../managers/gameManager";
import { GameTypes, IGuild } from "../types/api";
import { IGuildUpdateArgs } from "../types/apiReqs";
import { PermissionTypes } from "../types/custom";
import { uniqueFilter } from "../util/arrays";
import { isMemberAdminOrPrivileged } from "../util/permissions";
type GC = TextChannel | VoiceChannel | CategoryChannel | NewsChannel | StoreChannel | StageChannel
export default {
    name: 'permissions',
    execute: async (interaction: CommandInteraction) => {
        if (!interaction.guild)
            return interaction.reply(`You can't edit permissions in DM`)

        const guildConfig = await api.get(`/guild/${interaction.guild.id}`) as IGuild
        if (!isMemberAdminOrPrivileged(guildConfig, interaction.member as GuildMember))
            return await interaction.reply({ content: `This command can only be used by server admins or privileged users`, ephemeral: true })

        const cmdGroup = interaction.options.getSubcommandGroup(true) as PermissionTypes
        const isAdd = interaction.options.getSubcommand(true) === 'add'
        const change = getChangeValue(interaction, cmdGroup)
        if (cmdGroup === `c`)
            if ((change as GC).isVoice())
                return await interaction.reply({ content: `Selected channel can't be voice channel`, ephemeral: true })
            else if ((change as GC).isThread())
                return await interaction.reply({ content: `Selected channel can't be thread channel`, ephemeral: true })
            else if (!(change as GC).isText())
                return await interaction.reply({ content: `Selected channel can't be channel group`, ephemeral: true })
        let newValue = getCurrentValue(guildConfig, cmdGroup)
        if (isAdd)
            newValue.push(change.id)
        else
            newValue = newValue.filter(x => x !== change.id)
        let data: IGuildUpdateArgs
        switch (cmdGroup) {
            case 'pu':
                data = { privilegedUsers: newValue.filter(uniqueFilter) }
                break;
            case 'r':
                data = { whiteRoles: newValue.filter(uniqueFilter) }
                break;
            case 'c':
                data = { whiteChannels: newValue.filter(uniqueFilter) }
                break;
        }
        const newGuildConfig = await api.patch(`/guild/${interaction.guild?.id}`, data) as IGuild
        interaction.reply({ content: `Permissions updated`, ephemeral: true })
    }
}
function getCurrentValue(guildConfig: IGuild, type: PermissionTypes) {
    switch (type) {
        case 'pu':
            return guildConfig.privilegedUsers
        case 'c':
            return guildConfig.whiteChannels
        case 'r':
            return guildConfig.whiteRoles
    }
}
function getChangeValue(interaction: CommandInteraction, type: PermissionTypes) {
    switch (type) {
        case 'pu':
            return interaction.options.getUser('user', true)
        case 'c':
            return interaction.options.getChannel('channel', true)
        case 'r':
            return interaction.options.getRole('role', true)
    }
}