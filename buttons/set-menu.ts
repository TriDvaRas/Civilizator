import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getGameSetButtons } from "../managers/buttonManager";
import { createGameSetEmbed } from "../managers/embedManager";
import { IFullGame } from "../types/api";

export default {
    customId: 'set-menu',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game: IFullGame = await api.post(`/game/find`, {
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (game.phase !== 'join')
            return await interaction.update({ embeds: [createGameSetEmbed(game, 'wrongphase')], components: getGameSetButtons(game, `wrongphase`) })
        if (game.opId !== interaction.user.id)
            return await interaction.update({ embeds: [createGameSetEmbed(game, 'wrongop')], components: getGameSetButtons(game, `wrongop`) })

        await interaction.update({ embeds: [createGameSetEmbed(game, 'menu')], components: getGameSetButtons(game, 'menu') })
    }
}