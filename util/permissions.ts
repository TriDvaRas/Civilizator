import { GuildMember, TextChannel } from "discord.js";
import { IGuild } from "../types/api";

export function isMemberAdminOrPrivileged(guildConfig: IGuild, member: GuildMember) {
    if (member.id === guildConfig.ownerId) return true
    if (member.permissions.has('ADMINISTRATOR')) return true
    if (guildConfig.privilegedUsers.includes(member.id)) return true
    return false
}
export function canMemberStartGame(guildConfig: IGuild, member: GuildMember) {
    if (member.id === guildConfig.ownerId) return true
    if (guildConfig.whiteRoles.length === 0) return true
    if (member.permissions.has('ADMINISTRATOR')) return true
    if (guildConfig.whiteRoles.find(x => member.roles.cache.has(x))) return true
    return false
}
export function canGameStartHere(guildConfig: IGuild, channel: TextChannel) {
    if (guildConfig.whiteChannels.length === 0) return true
    if (guildConfig.whiteChannels.includes(channel.id)) return true
    return false
}