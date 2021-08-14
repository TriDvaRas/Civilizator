import { Guild, Message,  TextBasedChannels, ThreadChannel, User } from "discord.js";
import api from "../api/api";
import { GameTypes, IFullGame, IGame } from "../types/api";
import { IGameStartArgs } from "../types/apiReqs";

export async function newGame(gameSettings: {
    gameName: GameTypes, cpp: number, bpp: number
}, meta: {
    op: User, guild: Guild, message: Message, thread: ThreadChannel, channel: TextBasedChannels
}) {
    const { op, guild, message, thread, channel } = meta
    const data: IGameStartArgs = {
        ...gameSettings,
        guildId: guild.id,
        gameState: {
            channelId: channel.id,
            msgId: message.id,
            threadId: thread.id,
        },
        op: {
            id: op.id,
            tag: op.tag,
            avatar: op.avatar
        }
    }
    return await api.post(`/game`, data) as IFullGame
}