import { CommandInteraction } from "discord.js";
import gamemessage from './gamemessage'
export default {
    name: 'gm',
    execute: async (interaction: CommandInteraction) => {
        gamemessage.execute(interaction)
    }
}