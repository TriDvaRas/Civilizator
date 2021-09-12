import { Snowflake } from "discord.js";
import { AliasLanguages, GameTypes, PhaseTypes } from "./api";
import { IPickMsg } from "./custom";

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
    msgId?: Snowflake;
    pickIds?: IPickMsg[],
    civs?: number[],
    banned?: number[],
    rolled?: number[],
    disabled?: number[],
    dlcs?: number[],
    disabledDlcs?: number[],
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
    vote?: boolean;
    banned?: number[];
    rolled?: number[];
    picked?: number;
}
export interface IGuildCreateArgs {
    id: Snowflake;
    name: string;
    avatar?: string;
    ownerId: string;
}
export interface IGuildUpdateArgs {
    id?: Snowflake;
    name?: string;
    publicStats?: boolean;
    kicked?: boolean;
    news?: boolean;
    newsChannels?: Snowflake[];
    avatar?: string;
    ownerId?: string;
    rerollThreshold?: number;
    locales?: AliasLanguages[];
    whiteChannels?: Snowflake[];
    whiteRoles?: Snowflake[];
    privilegedUsers?: Snowflake[];
}

export interface IInteractionCreateArgs {
    type: 'command' | 'button'
    guildId?: string;
    userId: string;
    channelId: string;
}
export interface ICommandInteractionCreateArgs extends IInteractionCreateArgs {
    type: 'command'
    commandName: string;
    args: {}[];
}
export interface IButtonInteractionCreateArgs extends IInteractionCreateArgs {
    type: 'button'
    buttonName: string;
    messageId: string;
}
export interface IInteractionUpdateArgs {
    id: number;
    type: 'command' | 'button'
    successful: boolean;
}
export interface ICommandInteractionUpdateArgs extends IInteractionUpdateArgs {
    type: 'command'
}
export interface IButtonInteractionUpdateArgs extends IInteractionUpdateArgs {
    type: 'button'
}
export interface IButtonCreateArgs {
    name: string
}
export interface ICommandCreateArgs {
    name: string;
    description: string;
    example?: string;
    options?: {}[];
}