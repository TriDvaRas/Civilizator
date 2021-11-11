import { CommandInteraction } from "discord.js";
import pickmessages from './pickmessages'
export default {
    name: 'pm',
    execute: async (interaction: CommandInteraction) => {
        pickmessages.execute(interaction)
    }
}