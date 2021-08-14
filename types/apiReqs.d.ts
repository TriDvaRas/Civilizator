import { Snowflake } from "discord.js";
import { GameTypes, PhaseTypes } from "./api";

export interface IGameStartArgs {
    guildId: string;
    op: IPlayerCreateArgs;
    cpp: number;
    bpp: number;
    gameName: GameTypes;
    gameState: IGameStateStartArgs;
}
export interface IGameUpdateArgs {
    op: IPlayerCreateArgs;
    cpp: number;
    bpp: number;
    gameName: GameTypes;
    phase: PhaseTypes;
    gameState: IGameStateUpdateArgs;
}
export interface IGameStateStartArgs {
    channelId: string;
    msgId: string;
    threadId: string;
}
export interface IGameStateUpdateArgs {
    pickIds: Snowflake[],
    banned: number[],
    rolled: number[],
    disabled: number[],
    dlcs: number[],
    disabledDlcs: number[],
}
export interface IPlayerCreateArgs {
    id: Snowflake;
    tag: string;
    avatar?: string | null;
}
export interface IPlayerUpdateArgs {
    id: Snowflake;
    tag?: string;
    avatar?: string;
    publicStats?: boolean;
}
export interface IPlayerStateCreateArgs {
    gameId: number;
    player: IPlayerCreateArgs;
}
export interface IPlayerStateUpdateArgs {
    //! --------
}
export interface IGuildCreateArgs {
    id: Snowflake;
    name: string;
    avatar?: string;
    ownerId: string;
}
export interface IGuildUpdateArgs {
    id: Snowflake;
    name?: string;
    publicStats?: boolean;
    kicked?: boolean;
    news?: boolean;
    avatar?: string;
    ownerId?: string;
}