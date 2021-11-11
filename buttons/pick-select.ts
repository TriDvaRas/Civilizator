import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons, getGameSetButtons, getPickSelectButtons } from "../managers/buttonManager";
import { createGameEmbed, createGameSetEmbed, createPickSelectEmbed } from "../managers/embedManager";
import { IFullGame, IPlayer, IPlayerState } from "../types/api";
import { findGameMessage } from "../util/messages";

export default {
    customId: 'pick-select',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game: IFullGame = await api.post(`/game/find`, {
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        const playerState = game.playerStates.find(x => x.playerId === interaction.user.id)
        if (!playerState)
            return interaction.reply({ content: `You are not a player`, ephemeral: true })

        const newValue = args[0]
        if (newValue === undefined || !playerState.rolled.includes(Number(newValue))) {
            log.warn(`Invalid button data: ${interaction.customId} | [${args.join(`, `)}]`)
            return await interaction.update({ embeds: [createPickSelectEmbed(game, playerState)], components: [getPickSelectButtons(game, playerState)] })
        }
        const newGame: IFullGame = await api.patch(`/playerstate/${game.id}/${interaction.user.id}`, {
            picked: newValue 
        })
        const newPlayerState = newGame.playerStates.find(x => x.playerId === interaction.user.id) as IPlayerState
        const gameMessage = await findGameMessage(interaction.channelId as string, game.state.msgId)
        gameMessage?.edit({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
        await interaction.update({ embeds: [createPickSelectEmbed(newGame, newPlayerState)], components: [getPickSelectButtons(newGame, newPlayerState)] })
    }
}