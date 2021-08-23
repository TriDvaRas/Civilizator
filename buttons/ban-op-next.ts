import { ButtonInteraction, ThreadChannel } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons, getLoadingButton } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { rollPicks, sendPicks } from "../managers/rollManager";
import { IFullGame } from "../types/api";
import { IGameUpdateArgs, IPlayerStateCreateArgs, IPlayerStateUpdateArgs } from "../types/apiReqs";
import { updatePicksInfo } from "../util/picks";

export default {
    customId: 'ban-op-next',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game: IFullGame = await api.post(`/game/find`, {
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (game.opId !== interaction.user.id && interaction.user.id !== process.env.BOT_OWNER_ID)
            return interaction.reply({ content: `Only game operator can use this command`, ephemeral: true })
        const data = {
            phase: 'pick',
        } as IGameUpdateArgs
        let newGame = await api.patch(`/game/${game.id}`, data) as IFullGame
        //send picks
        await interaction.update({ embeds: [createGameEmbed(newGame)], components: [getLoadingButton(`Rolling...`)] })
        const picks = rollPicks(game)
        const pickMsgs = await sendPicks(game, picks, interaction.channel as ThreadChannel, game.state.pickIds)
        newGame = await updatePicksInfo(game, pickMsgs, picks);

        await interaction.editReply({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
    }
}