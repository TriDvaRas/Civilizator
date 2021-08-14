import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { IFullGame } from "../types/api";
import { IGameUpdateArgs, IPlayerStateCreateArgs } from "../types/apiReqs";

export default {
    customId: 'ban-skip',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game: IFullGame = await api.post(`/game/find`, {
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        const data = {
            phase: game.bpp > 0 ? 'ban' : 'pick',
        } as IGameUpdateArgs
        const newGame = await api.patch(`/game/${game.id}`, data) as IFullGame
        await interaction.update({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
    }
}