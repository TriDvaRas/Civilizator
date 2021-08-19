import { CommandInteraction, MessageEmbed } from "discord.js";
import { findGame } from "../util/games";

export default {
    name: 'dlcs',
    execute: async (interaction: CommandInteraction) => {
        const _public = interaction.options.getBoolean('public', false) || false
        const game = await findGame({
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (!interaction.guild || !interaction.channel?.isThread() || !game)
            return await interaction.reply({ content: `This command can only be used in game threads created with \`/start\` command`, ephemeral: true })
        return await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .addField(`Enabled DLCs`, `${game.state.dlcs.join(`\n`)}\u200B`, true)
                    .addField(`Disabled DLCs`, `${game.state.disabledDlcs.join(`\n`)}\u200B`, true)
                    .setFooter(`This message **doesn't** update automaticaly on game settings changing`)
            ], 
            ephemeral: !_public
        })
    }
}