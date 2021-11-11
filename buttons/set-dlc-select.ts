import { ButtonInteraction } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons, getGameSetButtons } from "../managers/buttonManager";
import { createGameEmbed, createGameSetEmbed } from "../managers/embedManager";
import { IFullGame } from "../types/api";
import { uniqueFilter } from "../util/arrays";
import { filterDlcs, filterPersonas } from "../util/civlist";
import { findGameMessage } from "../util/messages";

export default {
    customId: 'set-dlc-select',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game: IFullGame = await api.post(`/game/find`, {
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (game.phase !== 'join')
            return await interaction.update({ embeds: [createGameSetEmbed(game, 'wrongphase')], components: getGameSetButtons(game, `wrongphase`) })
        if (game.opId !== interaction.user.id)
            return await interaction.update({ embeds: [createGameSetEmbed(game, 'wrongop')], components: getGameSetButtons(game, `wrongop`) })

        const dlcValue = args[0]
        const dlcEnable = args[1] === 'true'

        if (dlcValue === undefined || !(game.state.dlcs.includes(dlcValue) || game.state.disabledDlcs.includes(dlcValue)) || ![`true`, `false`].includes(args[1])) {
            log.warn(`Invalid button data: ${interaction.customId} | [${args.join(`, `)}]`)
            return interaction.reply({ content: `Invalid button data. This shouldn't happen... Please message ${process.env.BOT_OWNER_TAG} about this `, ephemeral: true })
        }
        let newDlcs, newDisabledDlcs, newCivs, newDisabledCivs
        if (dlcEnable) {
            newDlcs = [...game.state.dlcs, dlcValue].filter(uniqueFilter)
            newDisabledDlcs = game.state.disabledDlcs.filter(x => x !== dlcValue).filter(uniqueFilter)
        }
        else {
            newDlcs = game.state.dlcs.filter(x => x !== dlcValue).filter(uniqueFilter)
            newDisabledDlcs = [...game.state.disabledDlcs, dlcValue].filter(uniqueFilter)
        }
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