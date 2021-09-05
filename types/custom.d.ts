import { ButtonInteraction, CommandInteraction, Snowflake } from "discord.js";

export type GameSettingsType = 'menu' | 'game' | 'cpp' | 'bpp' | 'dlc' | 'wrongphase' | 'wrongop'
export type GuildSettingsType = 'menu' | 'reroll' | 'news' | 'locale' | 'permissions'
export type PermissionTypes = 'pu' | 'c' | 'r'

export interface ICommand {
    name: string;
    execute: (interaction: CommandInteraction) => Promise<void>
}

export interface IButton {
    customId: string;
    execute: (interaction: ButtonInteraction, args: string[]) => Promise<void>
}

export interface IPickMsg {
    id: Snowflake;
    playerId: Snowflake | null;
}