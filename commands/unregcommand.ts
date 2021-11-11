import { ApplicationCommandManager, CommandInteraction, GuildApplicationCommandManager } from "discord.js";
import commandsRegData from "../data/commandsRegData";

export default {
    name: 'unregcommand',
    execute: async (interaction: CommandInteraction) => {
        const cmd = interaction.options.get('command', true).value
        const global = interaction.options.get('global', false)?.value || false
        const commands = await (((global ? client.application : interaction.guild)?.commands as GuildApplicationCommandManager).fetch())
        const command = commands.find(c => c.name == cmd)
        if (!command)
            return interaction.reply(`Can't find ${global ? `global` : `local`} command \`/${cmd}\` `)
        try {
            await client.application?.commands.delete(command.id, global ? undefined : interaction.guildId || undefined)
            return interaction.reply(`Unregistered ${global ? `global` : `local`} command \`/${cmd}\` `)
        } catch (error) {
            log.warn(`${error}`)
            return interaction.reply(`Failed unregistering ${global ? `global` : `local`} command \`/${cmd}\` `)
        }

    }
}