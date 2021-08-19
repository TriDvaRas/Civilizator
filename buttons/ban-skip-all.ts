import { ButtonInteraction, ThreadChannel } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons, getLoadingButton } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { sendPicks } from "../managers/rollManager";
import { IFullGame } from "../types/api";
import { IGameUpdateArgs, IPlayerStateCreateArgs, IPlayerStateUpdateArgs } from "../types/apiReqs";

export default {
    customId: 'ban-skip-all',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game: IFullGame = await api.post(`/game/find`, {
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        const player = game.playerStates.find(x => x.playerId === interaction.user.id)
        if (!player)
            return await interaction.reply({ content: `You are not this game's player`, ephemeral: true })
        if (player.banned.length === game.bpp)
            return await interaction.reply({ content: `You have no bans left`, ephemeral: true })
        const newBanned = player.banned
        while (newBanned.length < game.bpp) {
            newBanned.push(0)
        }
        const data = {
            banned: newBanned
        } as IPlayerStateUpdateArgs
        let newGame = await api.patch(`/playerstate/${game.id}/${player.playerId}`, data) as IFullGame

        if (newGame.playerStates.find(x => x.banned.length && x.banned.length < game.bpp))
            await interaction.update({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
        else {
            await interaction.update({ embeds: [createGameEmbed(newGame)], components: [getLoadingButton(`Rolling...`)] })
            const pickMsgs = await sendPicks(newGame, interaction.channel as ThreadChannel, newGame.state.pickIds)
            await api.patch(`/game/${newGame.id}`, {
                phase: 'pick',
                gameState: {
                    pickIds: pickMsgs
                }
            } as IGameUpdateArgs)
            newGame = await api.patch(`/playerstate/${newGame.id}/all`, {
                vote: false
            } as IPlayerStateUpdateArgs)

            await interaction.editReply({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
        }
    }
}