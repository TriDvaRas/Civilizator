import { Guild } from "discord.js";
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

}
export async function onGuildKick(guild: Guild) {
    await api.patch(`/guild/${guild.id}`, {
        kicked: true,
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