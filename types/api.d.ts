import { Snowflake } from "discord.js"

export type AliasLanguages = 'en' | 'it' | 'ru'
export type GameTypes = 'civ5' | 'lek' | 'civ6'
export type PhaseTypes = 'init' | 'join' | 'ban' | 'pick'
export type CommandTags = 'normal' | 'civ'
export type Civ5Dlc = string //TODO dlc list
export type Civ6Dlc = string //TODO dlc list
export type AnyDlc = Civ5Dlc | Civ6Dlc | 'lek' //TODO dlc list
export type PressenceReps = { [key: string]: any }
export type PressenceTypes = string
export interface ICivilizationAliases {
  AliasLanguages?: Array<string>;
}
export interface ICivilization {
  id: number;
  game: GameTypes;
  name: string;
  aliases: ICivilizationAliases;
  dlc: string;
  thumbnailPath: string;
  personaId?: number;
  color?: string;
}
export interface ICommand {
  id: number;
  name: string;
  tags: CommandTags[];
  description?: string;
  example?: string;
  options?: {}[];
}
export interface IPlayer {
  id: Snowflake;
  tag: string;
  joinedAt?: Date;
  avatar?: string;
  publicStats: boolean;
}
export interface IGuild {
  id: Snowflake;
  name: string;
  joinedAt?: Date;
  publicStats: boolean;
  kicked: boolean;
  news: boolean;
  fastCount: number;
  avatar?: string;
  ownerId?: Snowflake;//todo check if i have all ownerIds
}
export interface IGame {
  id: number;
  guildId: Snowflake;
  flushed: boolean;
  cpp: number;
  bpp: number;
  rerolls: number;
  gameName: GameTypes;
  playerCount: number;
  phase: PhaseTypes;
  startedAt: Date;
  opId: Snowflake;
  banCount: number;
}
export interface IGameState {
  gameId: number;
  channelId: Snowflake;
  msgId: Snowflake;
  threadId: Snowflake;
  pickIds?: Snowflake[];
  banned: number[];
  rolled: number[];
  disabled: number[];
  dlcs: AnyDlc[];
  disabledDlcs: AnyDlc[];
}
export interface IPlayerState {
  gameId: number;
  playerId: Snowflake;
  threadId: Snowflake;
  slot: number;
  vote: boolean;
  banned: number[];
  rolled: number[];
  picked?: number;
}
export interface IFullGame extends IGame {
  state: IGameState;
  playerStates: IPlayerState[];
  civlist: ICivilization[]
}
//!------------------
export interface IPressence {
  id: number;
  text: string;
  reps?: PressenceReps;
  type: PressenceTypes;
}
export interface IStat {
  date: Date;
  guilds?: number;
  games?: number;
  fasts?: number;
  players?: number;
}