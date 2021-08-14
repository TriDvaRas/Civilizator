import { ButtonInteraction, Snowflake } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { IFullGame } from "../types/api";
import { IGameUpdateArgs, IPlayerStateCreateArgs } from "../types/apiReqs";
import { findGame } from "../util/games";

export default {
    customId: 'join-op-next',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        const game = await findGame({
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (!game)
            return log.warn(`Game search failed in join-op-next (${interaction.guildId}/${interaction.channelId})`)
        if (game.opId !== interaction.user.id && interaction.user.id !== process.env.BOT_OWNER_ID)
            return interaction.reply({ content: `Only game operator can use this command`, ephemeral: true })
        const data = {
            phase: game.bpp > 0 ? 'ban' : 'pick',
        } as IGameUpdateArgs
        const newGame = await api.patch(`/game/${game.id}`, data) as IFullGame
        
        await interaction.update({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
    }
}


