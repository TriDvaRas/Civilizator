import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import * as fs from 'fs'
import path from 'path';
import { getAnnounceButtons } from "../managers/buttonManager";
import { getAnnounceMessageEmbeds } from "../util/embeds";

export default {
    name: 'announce',
    execute: async (interaction: CommandInteraction) => {
        try {
            if (interaction.user.id === process.env.BOT_OWNER_ID) {
                let ann = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../assets/json/announcement.json`)) as any)
                const messageArgs = { embeds: getAnnounceMessageEmbeds(ann, interaction.user), components: getAnnounceButtons(), ephemeral: true };
                interaction.reply(messageArgs)
                //TODO add buttons
            }
        } catch (error) {
            interaction.reply({ content: `${error}`, ephemeral: true })
        }

    }
}

