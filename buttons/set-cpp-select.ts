import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons, getGameSetButtons } from "../managers/buttonManager";
import { createGameEmbed, createGameSetEmbed } from "../managers/embedManager";
import { IFullGame } from "../types/api";
import { findGameMessage } from "../util/messages";

export default {
    customId: 'set-cpp-select',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game: IFullGame = await api.post(`/game/find`, {
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (game.phase !== 'join')
            return await interaction.update({ embeds: [createGameSetEmbed(game, 'wrongphase')], components: getGameSetButtons(game, `wrongphase`) })
        if (game.opId !== interaction.user.id)
            return await interaction.update({ embeds: [createGameSetEmbed(game, 'wrongop')], components: getGameSetButtons(game, `wrongop`) })
            
        const newValue = Number(args[0])
        if (!newValue || newValue < 1 || newValue > 6) {
            log.warn(`Invalid button data: ${interaction.customId} | [${args.join(`, `)}]`)
            return interaction.reply({ content: `Invalid button data. This shouldn't happen... Please message ${process.env.BOT_OWNER_TAG} about this `, ephemeral: true })
        }
        const newGame: IFullGame = await api.patch(`/game/${game.id}`, {
            cpp: newValue
        })
        const gameMessage = await findGameMessage(interaction.channelId as string, game.state.msgId)
        gameMessage?.edit({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
        await interaction.update({ embeds: [createGameSetEmbed(newGame, 'cpp')], components: getGameSetButtons(newGame, 'cpp') })
    }
}