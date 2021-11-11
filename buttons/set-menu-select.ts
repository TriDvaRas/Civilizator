import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getGameSetButtons } from "../managers/buttonManager";
import { createGameSetEmbed } from "../managers/embedManager";
import { IFullGame } from "../types/api";
import { GameSettingsType } from "../types/custom";

export default {
    customId: 'set-menu-select',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game: IFullGame = await api.post(`/game/find`, {
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (game.phase !== 'join')
            return await interaction.update({ embeds: [createGameSetEmbed(game, 'wrongphase')], components: getGameSetButtons(game, `wrongphase`) })
        if (game.opId !== interaction.user.id)
            return await interaction.update({ embeds: [createGameSetEmbed(game, 'wrongop')], components: getGameSetButtons(game, `wrongop`) })

        const value = args[0] as GameSettingsType
        await interaction.update({ embeds: [createGameSetEmbed(game, value)], components: getGameSetButtons(game, value) })
    }
}