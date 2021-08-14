import { Collection, CommandInteraction } from "discord.js";
import fs from 'fs';
import path from 'path';
import { ICommand } from "../types/custom";

const commands = new Collection<string, ICommand>();
const commandFiles = fs.readdirSync(path.resolve(__dirname, '../commands')).filter(file => file.endsWith('.ts'));
for (const file of commandFiles) {
    const command: ICommand = require(`../commands/${file}`).default;
    commands.set(command.name, command);
}

export default async function slashCommandHandler(interaction: CommandInteraction) {
    const command = commands.get(interaction.commandName)
    if (!command) {
        interaction.reply({
            content: `Missing command handler for \`/${interaction.commandName}\`. \nIf you are sure this command should work please contact \`${process.env.BOT_OWNER_TAG}\``,
            ephemeral: true
        })
        return log.warn(`Missing command handler for /${interaction.commandName}`)
    }
    else
        try {
            await command.execute(interaction)
        } catch (error) {
            log.error(error.stack)
            if (!interaction.replied)
                await interaction.reply({
                    content: `Unexpected error while processing your interaction. It was logged, but if you want it to be fixed sooner you can message ${process.env.BOT_OWNER_TAG} about this`,
                    ephemeral: true
                })
        }
}