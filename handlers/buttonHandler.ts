import { ButtonInteraction, Collection } from "discord.js";
import fs from 'fs';
import path from 'path';
import { IButton } from "../types/custom";

const buttons = new Collection<string, IButton>();
const buttonFiles = fs.readdirSync(path.resolve(__dirname, '../buttons')).filter(file => file.endsWith('.ts'));
for (const file of buttonFiles) {
    const command: IButton = require(`../buttons/${file}`).default;
    buttons.set(command.customId, command);
}

export default async function buttonHandler(interaction: ButtonInteraction) {
    const cid = interaction.customId.split(`/`)
    const button = buttons.get(cid.shift() as string)
    if (!button) {
        interaction.reply({
            content: `Missing button handler for \`${interaction.customId}\`.`,
            ephemeral: true
        })
        return log.warn(`Missing button handler for ${interaction.customId}`)
    }
    else
        try {
            await button.execute(interaction, cid)
        } catch (error) {
            log.error(error.stack)
            if (!interaction.replied)
                await interaction.reply({
                    content: `Unexpected error while processing your interaction. It was logged, but if you want it to be fixed sooner you can message ${process.env.BOT_OWNER_TAG} about this`,
                    ephemeral: true
                })
        }
}