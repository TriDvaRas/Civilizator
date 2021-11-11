import { ButtonInteraction, ThreadChannel } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons, getLoadingButton } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { rollPicks, sendPicks } from "../managers/rollManager";
import { IFullGame } from "../types/api";
import { IGameUpdateArgs, IPlayerStateCreateArgs, IPlayerStateUpdateArgs } from "../types/apiReqs";
import { updatePicksInfo } from "../util/picks";

export default {
    customId: 'ban-skip',
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
        const data = {
            banned: [...player.banned, 0]
        } as IPlayerStateUpdateArgs
        let newGame = await api.patch(`/playerstate/${game.id}/${player.playerId}`, data) as IFullGame
        await interaction.channel?.send({ content: `<@${interaction.user.id}> skipped \`${1}\` ban` })
        
        if (newGame.playerStates.find(x => x.banned.length && x.banned.length < game.bpp))
            await interaction.update({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
        else {
            await interaction.update({ embeds: [createGameEmbed(newGame)], components: [getLoadingButton(`Rolling...`)] })
            const picks = rollPicks(game)
            const pickMsgs = await sendPicks(newGame, picks, interaction.channel as ThreadChannel, newGame.state.pickIds)
            newGame = await updatePicksInfo(game, pickMsgs, picks);

            await interaction.editReply({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
        }
    }
}