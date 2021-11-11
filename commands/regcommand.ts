import { CommandInteraction } from "discord.js";
import commandsPermData from "../data/commandsPermData";
import commandsRegData from "../data/commandsRegData";

export default {
    name: 'regcommand',
    execute: async (interaction: CommandInteraction) => {
        const cmd = interaction.options.get('command', true).value
        const global = interaction.options.get('global', false)?.value || false
        const regData = commandsRegData[`${cmd}`]
        if (!regData)
            return interaction.reply(`No RegData found for \`/${cmd}\``)
        const command = await (global ? client.application : interaction.guild)?.commands.create(regData);
        const permData = commandsPermData[`${cmd}`]
        if (!command)
            return interaction.reply(`Failed registering ${global ? `global` : `local`} command \`/${cmd}\` `)
        const perm = (permData && !global) ? (await command.permissions.set({ permissions: permData })) : []
        
        return interaction.reply(`Registered ${global ? `global` : `local`} command \`/${cmd}\` with \`${perm ? perm.length : `0`}\` permissions`)
    }
}