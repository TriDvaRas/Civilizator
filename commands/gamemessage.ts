import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { IFullGame } from "../types/api";
import { IGameUpdateArgs } from "../types/apiReqs";
import { findGame } from "../util/games";
import { findGameMessage } from "../util/messages";

export default {
    name: 'gamemessage',
    execute: async (interaction: CommandInteraction) => {
        const game = await findGame({
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (!interaction.guild || !interaction.channel?.isThread() || !game)
            return await interaction.reply({ content: `This command can only be used in game threads created with \`/start\` command`, ephemeral: true })
        if (game.opId !== interaction.user.id && interaction.user.id !== process.env.BOT_OWNER_ID)
            return interaction.reply({ content: `Only game operator can use this command`, ephemeral: true })
        const gameMessage = await findGameMessage(interaction.channelId as string, game.state.msgId)
        if (Date.now() - gameMessage.createdTimestamp < 15000)
            return interaction.reply({ content: `You've gust resent it. Why would you want to do it again?🤔`, ephemeral: true })
        
        await interaction.reply(`Resending game message...`)
        const newMessage = await interaction.channel.send({ embeds: [createGameEmbed(game)], components: getGameEmbedButtons(game) })
        await (await interaction.channel.messages.fetch(game.state.msgId)).delete()
        await interaction.editReply(`Game message resent`)
        const data = {
            cpp: game.cpp,
            gameState: {
                msgId: newMessage.id
            }
        } as IGameUpdateArgs
        let newGame = await api.patch(`/game/${game.id}`, data) as IFullGame

    }
}