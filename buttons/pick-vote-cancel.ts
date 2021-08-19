import { ButtonInteraction, MessageAttachment, MessageEmbed, ThreadChannel, User } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons, getLoadingButton } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { createPicksMessage, rollPicks, sendPicks } from "../managers/rollManager";
import { IFullGame } from "../types/api";
import { IGameUpdateArgs, IPlayerStateUpdateArgs } from "../types/apiReqs";

export default {
    customId: 'pick-vote-cancel',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game: IFullGame = await api.post(`/game/find`, {
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (!game.playerStates.find(x => x.playerId === interaction.user.id))
            return interaction.reply({ content: `You are not a player`, ephemeral: true })
        let newGame: IFullGame = await api.patch(`/playerstate/${game.id}/${interaction.user.id}`, {
            vote: false
        } as IPlayerStateUpdateArgs)

        await interaction.update({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
    }
}