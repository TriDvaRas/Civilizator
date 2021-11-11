import { Guild, MessageEmbed, TextChannel } from "discord.js";
import api from "../api/api";
import { IGuild } from "../types/api";

export async function onGuildJoin(guild: Guild) {
    const config: IGuild = await api.get(`/guild/${guild.id}`)
    if (config)
        await api.patch(`/guild/${guild.id}`, {
            name: guild.name,
            kicked: false,
            avatar: guild.icon,
            ownerId: guild.ownerId,
        })
    else
        await api.post(`/guild/${guild.id}`, {
            name: guild.name,
            avatar: guild.icon,
            ownerId: guild.ownerId,
        })
    const logChannel = await client.channels.fetch(process.env.GUILDLOG_CHANNEL_ID as string) as TextChannel
    if (!logChannel)
        return
    logChannel.send({
        embeds: [
            new MessageEmbed()
                .setTitle(`Joined ${guild.name}`)
                .setDescription(guild.id)
                .setThumbnail(guild.iconURL() || ``)
                .addField(`Users`, `${guild.memberCount}`, true)
                .addField(`New Guilds Count`, `${client.guilds.cache.size}`, true)
                .addField(`Config Restored`, `${config ? `Yes` : `No`}`, true)
                .setFooter(`Owner: ${guild.ownerId}/${(await guild.members.fetch(guild.ownerId)).user.tag}`)
                .setColor(`#26EA90`)
        ]
    })
}
export async function onGuildKick(guild: Guild) {
    const config: IGuild = await api.patch(`/guild/${guild.id}`, {
        kicked: true,
    })
    const logChannel = await client.channels.fetch(process.env.GUILDLOG_CHANNEL_ID as string) as TextChannel
    if (!logChannel)
        return
    logChannel.send({
        embeds: [
            new MessageEmbed()
                .setTitle(`Left ${guild.name}`)
                .setDescription(guild.id)
                .setThumbnail(guild.iconURL() || ``)
                .addField(`Members Count`, `${guild.memberCount}`, true)
                .addField(`New Guilds Count`, `${client.guilds.cache.size}`, true)
                .setFooter(`Owner: ${config.ownerId}/?`)
                .setColor(`#EA2667`)
        ]
    })
}
export async function onGuildUpdate(oldGuild: Guild, newGuild: Guild) {
    const config: IGuild = await api.get(`/guild/${newGuild.id}`)
    if (config)
        await api.patch(`/guild/${newGuild.id}`, {
            name: newGuild.name && newGuild.name === oldGuild.name ? newGuild.name : undefined,
            avatar: newGuild.icon && newGuild.icon === oldGuild.icon ? newGuild.icon : undefined,
            ownerId: newGuild.ownerId && newGuild.ownerId === oldGuild.ownerId ? newGuild.ownerId : undefined,
        })
    else
        await api.post(`/guild/${newGuild.id}`, {
            name: newGuild.name,
            avatar: newGuild.icon,
            ownerId: newGuild.ownerId,
        })
}