import { ApplicationCommandManager, CommandInteraction, GuildApplicationCommandManager } from "discord.js";
import commandsRegData from "../data/commandsRegData";

export default {
    name: 'unregallcommands',
    execute: async (interaction: CommandInteraction) => {
        const global = interaction.options.get('global', false)?.value || false
        const commands = await (((global ? client.application : interaction.guild)?.commands as GuildApplicationCommandManager).fetch())
        const reps = []
        for await (const command of commands.values()) {
            if (command.name.includes(`reg`) && command.name.includes(`command`)) continue
            try {
                await client.application?.commands.delete(command.id, global ? undefined : interaction.guildId || undefined)
                reps.push(`Unregistered ${global ? `global` : `local`} command \`/${command.name}\` `)
            } catch (error) {
                log.warn(`${error}`)
                reps.push(`Failed unregistering ${global ? `global` : `local`} command \`/${command.name}\` `)
            }
        }
        interaction.reply(`${reps.join(`\n`)}\u200B`)

    }
}