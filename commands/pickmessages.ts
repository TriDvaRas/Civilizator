import { ColorResolvable, CommandInteraction, MessageEmbed, MessagePayload, ThreadChannel } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { getPicks, sendPicks } from "../managers/rollManager";
import { IFullGame } from "../types/api";
import { IGameUpdateArgs } from "../types/apiReqs";
import { findGame } from "../util/games";
import { findPickMessages } from "../util/messages";

export default {
    name: 'pickmessages',
    execute: async (interaction: CommandInteraction) => {
        const game = await findGame({
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (!interaction.guild || !interaction.channel?.isThread() || !game)
            return await interaction.reply({ content: `This command can only be used in game threads created with \`/start\` command`, ephemeral: true })
        if (game.opId !== interaction.user.id && interaction.user.id !== process.env.BOT_OWNER_ID)
            return interaction.reply({ content: `Only game operator can use this command`, ephemeral: true })
        if (game.phase !== 'pick')
            return interaction.reply({ content: `This command can only be used during picks phase`, ephemeral: true })
        const pickMessages = await findPickMessages(game.state.threadId, game.state.pickIds?.map(x => x.id) || [])
        if (pickMessages.find(x => x && Date.now() - x.createdTimestamp < 60000))
            return interaction.reply({ content: `You've gust resent them. Why would you want to do it again?🤔`, ephemeral: true })
        await interaction.reply(`Resending picks messages...`)
        await Promise.all(pickMessages.map(async m => {
            if (m) return m.delete()
        }))
        const picks = getPicks(game)
        const pickMsgs = await sendPicks(game, picks, interaction.channel as ThreadChannel, game.state.pickIds)
        await interaction.editReply(`Picks messages resent`)
        const data = {
            cpp: game.cpp,
            gameState: {
                pickIds: pickMsgs
            }
        } as IGameUpdateArgs
        let newGame = await api.patch(`/game/${game.id}`, data) as IFullGame

    }
}