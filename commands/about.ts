import { CommandInteraction } from "discord.js";
import * as fs from 'fs';
import path from 'path';
import { getAboutMessageEmbeds } from "../util/embeds";

export default {
    name: 'about',
    execute: async (interaction: CommandInteraction) => {
        let ab = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../assets/json/about.json`)) as any)
        const messageArgs = { embeds: getAboutMessageEmbeds(ab) };
        interaction.reply(messageArgs)
    }
}