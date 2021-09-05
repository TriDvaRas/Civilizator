import { ButtonInteraction, MessageAttachment, MessageEmbed, ThreadChannel, User } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons, getLoadingButton } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { createPicksMessage, rollPicks, sendPicks } from "../managers/rollManager";
import { IFullGame } from "../types/api";
import { IGameUpdateArgs, IPlayerStateUpdateArgs } from "../types/apiReqs";
import { updatePicksInfo } from "../util/picks";

export default {
    customId: 'pick-vote',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game: IFullGame = await api.post(`/game/find`, {
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (!game.playerStates.find(x => x.playerId === interaction.user.id))
            return interaction.reply({ content: `You are not this game's player`, ephemeral: true })
        let newGame: IFullGame = await api.patch(`/playerstate/${game.id}/${interaction.user.id}`, {
            vote: true
        } as IPlayerStateUpdateArgs)


        // reroll sequence
        const threshold = newGame.playerStates.length * game.guildConfig.rerollThreshold / 100
        const votesCount = newGame.playerStates.filter(x => x.vote).length

        if (votesCount >= threshold) {
            await interaction.update({ embeds: [createGameEmbed(newGame)], components: [getLoadingButton(`Rerolling...`)] })
            const picks = rollPicks(game)
            const pickMsgs = await sendPicks(game, picks, interaction.channel as ThreadChannel, game.state.pickIds)
            newGame = await updatePicksInfo(game, pickMsgs, picks);

            await interaction.editReply({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
        }
        else
            await interaction.update({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
    }
}