import axios from "axios";
import { ButtonInteraction, Message, ThreadChannel } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { IFullGame } from "../types/api";
import { IPlayerStateCreateArgs } from "../types/apiReqs";
import { findGameId } from "../util/games";

export default {
    customId: 'join-join',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const gameId = await findGameId({
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        const data = {
            gameId: gameId,
            player: {
                id: interaction.user.id,
                tag: interaction.user.tag,
                avatar: interaction.user.avatar,
            }
        } as IPlayerStateCreateArgs
        const game = await api.post(`/playerstate`, data) as IFullGame
        await interaction.update({ embeds: [createGameEmbed(game)], components: getGameEmbedButtons(game) })
    }
}