import { ButtonInteraction, Snowflake, ThreadChannel } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons, getLoadingButton } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { rollPicks, sendPicks } from "../managers/rollManager";
import { IFullGame } from "../types/api";
import { IGameUpdateArgs, IPlayerStateCreateArgs, IPlayerStateUpdateArgs } from "../types/apiReqs";
import { isEnoughCivsToStartGame } from "../util/civlist";
import { findGame } from "../util/games";
import { updatePicksInfo } from "../util/picks";

export default {
    customId: 'join-op-next',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game = await findGame({
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (!game)
            return log.warn(`Game search failed in join-op-next (${interaction.guildId}/${interaction.channelId})`)
        if (game.opId !== interaction.user.id && interaction.user.id !== process.env.BOT_OWNER_ID)
            return interaction.reply({ content: `Only game operator can use this command`, ephemeral: true })
        if (!isEnoughCivsToStartGame(game)) {
            await interaction.update({ embeds: [createGameEmbed(game)], components: getGameEmbedButtons(game) })
            return interaction.followUp({ content: `Not enough civs to proceed`, ephemeral: true })
        }

        const data = {
            phase: game.bpp > 0 ? 'ban' : 'pick',
        } as IGameUpdateArgs
        let newGame = await api.patch(`/game/${game.id}`, data) as IFullGame
        //send picks 
        if (game.bpp === 0) {
            await interaction.update({ embeds: [createGameEmbed(newGame)], components: [getLoadingButton(`Rolling...`)] })
            const picks = rollPicks(game)
            const pickMsgs = await sendPicks(game, picks, interaction.channel as ThreadChannel, game.state.pickIds)
            newGame = await updatePicksInfo(game, pickMsgs, picks);

            await interaction.editReply({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
        }
        else
            await interaction.update({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
    }
}




