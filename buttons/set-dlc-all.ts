import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons, getGameSetButtons } from "../managers/buttonManager";
import { createGameEmbed, createGameSetEmbed } from "../managers/embedManager";
import { IFullGame } from "../types/api";
import { uniqueFilter } from "../util/arrays";
import { filterDlcs, filterPersonas } from "../util/civlist";
import { findGameMessage } from "../util/messages";

export default {
    customId: 'set-dlc-all',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game: IFullGame = await api.post(`/game/find`, {
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (game.phase !== 'join')
            return await interaction.update({ embeds: [createGameSetEmbed(game, 'wrongphase')], components: getGameSetButtons(game, `wrongphase`) })
        if (game.opId !== interaction.user.id)
            return await interaction.update({ embeds: [createGameSetEmbed(game, 'wrongop')], components: getGameSetButtons(game, `wrongop`) })

        let newDlcs, newDisabledDlcs: string[], newCivs, newDisabledCivs
        newDlcs = [...game.state.disabledDlcs, ...game.state.dlcs].filter(uniqueFilter)
        newDisabledDlcs = [];
        [newCivs, newDisabledCivs] = filterPersonas(newDlcs.includes('Persona Pack'), game.civlist);
        [newCivs, newDisabledCivs] = filterDlcs(newDlcs, game.civlist, newDisabledCivs)

        const newGame: IFullGame = await api.patch(`/game/${game.id}`, {
            cpp: game.cpp,
            gameState: {
                dlcs: newDlcs,
                disabledDlcs: newDisabledDlcs,
                civs: newCivs,
                disabled: newDisabledCivs,
            }
        })
        const gameMessage = await findGameMessage(interaction.channelId as string, game.state.msgId)
        gameMessage?.edit({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
        await interaction.update({ embeds: [createGameSetEmbed(newGame, 'dlc')], components: getGameSetButtons(newGame, 'dlc') })
    }
}