import { CommandInteraction } from "discord.js";
import { getGameSetButtons } from "../managers/buttonManager";
import { createGameSetEmbed } from "../managers/embedManager";
import { findGame } from "../util/games";

export default {
    name: 'set',
    execute: async (interaction: CommandInteraction) => {
        const game = await findGame({
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (!interaction.guild || !interaction.channel?.isThread() || !game)
            return await interaction.reply({ content: `This command can only be used in game threads created with \`/start\` command`, ephemeral: true })
        await interaction.reply({ embeds: [createGameSetEmbed(game, 'menu')], components: getGameSetButtons(game, 'menu'), ephemeral: true })
    }
}