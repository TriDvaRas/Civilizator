import axios from "axios";
import { ButtonInteraction, Message, ThreadChannel } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { IFullGame } from "../types/api";
import { findGameId } from "../util/games";

export default {
    customId: 'join-leave',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const gameId = await findGameId({
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        const game = await api.delete(`/playerstate/${gameId}/${interaction.user.id}`) as IFullGame
        await interaction.update({ embeds: [createGameEmbed(game)], components: getGameEmbedButtons(game) })
    }
}