import { Snowflake } from "discord.js";
import api from "../api/api";
import { IFullGame } from "../types/api";

export async function findGame(query: {
    threadId: Snowflake | null,
    guildId: Snowflake | null,
}): Promise<IFullGame | undefined> {
    return await api.post(`/game/find`, query) as IFullGame;
}
export async function findGameId(query: {
    threadId: Snowflake | null,
    guildId: Snowflake | null,
}): Promise<number | undefined> {
    return (await api.post(`/game/findid`, query)).id as number;
}