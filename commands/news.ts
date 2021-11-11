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
export default {
    name: 'news',
    execute: async (interaction: CommandInteraction) => {
        if (!interaction.guild)
            return interaction.reply(`You can't edit permissions in DM`)

        const guildConfig = await api.get(`/guild/${interaction.guild.id}`) as IGuild
        if (!isMemberAdminOrPrivileged(guildConfig, interaction.member as GuildMember))
            return await interaction.reply({ content: `This command can only be used by server admins or privileged users`, ephemeral: true })

        const isAdd = interaction.options.getSubcommand(true) === 'add'
        const newChannel = interaction.options.getChannel('channel', true) as GuildChannel
        if (newChannel.isVoice())
            return await interaction.reply({ content: `Selected channel can't be voice channel`, ephemeral: true })
        else if (newChannel.isThread())
            return await interaction.reply({ content: `Selected channel can't be thread channel`, ephemeral: true })
        else if (!newChannel.isText())
            return await interaction.reply({ content: `Selected channel can't be channel group`, ephemeral: true })

        let newValue = guildConfig.newsChannels
        if (isAdd)
            newValue.push(newChannel.id)
        else
            newValue = newValue.filter(x => x !== newChannel.id)
        const newGuildConfig = await api.patch(`/guild/${interaction.guild?.id}`, { newsChannels: newValue.filter(uniqueFilter) }) as IGuild
        interaction.reply({ content: `News channels updated`, ephemeral: true })
    }
}