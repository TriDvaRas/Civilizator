import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getPickSelectButtons } from "../managers/buttonManager";
import { createPickSelectEmbed } from "../managers/embedManager";
import { IFullGame } from "../types/api";

export default {
    customId: 'pick-show-select-menu',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game: IFullGame = await api.post(`/game/find`, {
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        const playerState = game.playerStates.find(x => x.playerId === interaction.user.id)
        if (!playerState)
            return interaction.reply({ content: `You are not a player`, ephemeral: true })
        interaction.reply({ embeds: [createPickSelectEmbed(game, playerState)], components: [getPickSelectButtons(game, playerState)], ephemeral: true })
    }
}