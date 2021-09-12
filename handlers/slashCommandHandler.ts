import { Collection, CommandInteraction, TextChannel } from "discord.js";
import fs from 'fs';
import path from 'path';
import { ICommand, ICommandInteraction } from "../types/custom";
import { format as prettyFormat } from 'pretty-format';
import api from "../api/api";
import { ICommandInteractionCreateArgs, ICommandInteractionUpdateArgs } from "../types/apiReqs";

const commands = new Collection<string, ICommand>();
const commandFiles = fs.readdirSync(path.resolve(__dirname, '../commands')).filter(file => file.endsWith('.ts'));
for (const file of commandFiles) {
    const command: ICommand = require(`../commands/${file}`).default;
    commands.set(command.name, command);
}

export default async function slashCommandHandler(interaction: CommandInteraction) {
    const command = commands.get(interaction.commandName)

    log.log(`cmd`, {
        command: `**${interaction.commandName}**\n${(interaction.options as any)?._hoistedOptions.map((x: any) => `\t**${x.name}**: ${x.type} = ${x.value}`).join(`\n`)}`,
        guild: `${interaction.guildId}\n${interaction.guild?.name}`,
        channel: `${interaction.channel?.type}\n${interaction.channelId}\n${(interaction.channel as TextChannel | null)?.name}`,
        user: `${interaction.user.id}\n${interaction.user.username}`
    })
    if (!command) {
        interaction.reply({
            content: `Missing command handler for \`/${interaction.commandName}\`. \nIf you are sure this command should work please contact \`${process.env.BOT_OWNER_TAG}\``,
            ephemeral: true
        })
        return log.warn(`Missing command handler for /${interaction.commandName}`)
    }
    else
        try {
            const interactionLog = await api.post(`/interaction`, {
                type: 'command',
                guildId: interaction.guildId,
                userId: interaction.user.id,
                channelId: interaction.channelId,
                commandName: command.name,
                args: (interaction.options as any)?._hoistedOptions
            } as ICommandInteractionCreateArgs) as ICommandInteraction
            await command.execute(interaction)
            console.log(await api.patch(`/interaction`, {
                id: interactionLog.id,
                type: 'command',
                successful: true,
            } as ICommandInteractionUpdateArgs));
            
        } catch (error: any) {
            log.error(command.name)
            log.error(error.stack)
            if (!interaction.replied)
                await interaction.reply({
                    content: `Unexpected error while processing your interaction. It was logged, but if you want it to be fixed sooner you can message ${process.env.BOT_OWNER_TAG} about this`,
                    ephemeral: true
                })
        }
}