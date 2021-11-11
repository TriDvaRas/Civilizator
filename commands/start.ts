import { ColorResolvable, CommandInteraction, Message, MessageEmbed } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons } from "../managers/buttonManager";
import { createBaseGameEmbed, createGameEmbed } from "../managers/embedManager";
import { newGame } from "../managers/gameManager";
import { GameTypes, IGuild } from "../types/api";

export default {
    name: 'start',
    execute: async (interaction: CommandInteraction) => {
        if (!interaction.guild)
            return interaction.reply(`You can't start a game in DM`)
        const guildConfig: IGuild = await api.get(`/guild/${interaction.guildId}`)
        if (guildConfig.whiteChannels.length > 0 && !guildConfig.whiteChannels.includes(interaction.channelId))
            return interaction.reply({ content: `You can't start a game in this channel\nAllowed channels: ${guildConfig.whiteChannels.map(x => `<#${x}>`)}`, ephemeral: true })
        const gameName = interaction.options.getSubcommand(true) as GameTypes
        const cpp = interaction.options.getInteger(`cpp`, true)
        const bpp = interaction.options.getInteger(`bpp`, true)
        const msg = await interaction.reply({ content: `Creating new thread...`, fetchReply: true }) as Message
        const freeId = (await api.get(`/game/freeid`)).id
        const thread = await msg.startThread({
            name: `Civilizator Game #${freeId}`,
            autoArchiveDuration: 1440,
            reason: `New Civilizator game started`
        }).catch(() => { interaction.editReply(`Missing permissions to create threads`) })
        if (!thread) return
        const message = await thread.send({ embeds: [createBaseGameEmbed()] })
        const game = await newGame({ gameName, cpp, bpp }, {
            op: interaction.user,
            guild: interaction.guild,
            message,
            thread,
            channel: msg.channel
        })
        if (!game) return
        if (freeId !== game.id)
            await thread.setName(`Civilizator Game ${game.id}`)
        await message.edit({ embeds: [createGameEmbed(game)], components: getGameEmbedButtons(game) })
        await msg.edit({ content: `Game ${game.id} started. Join the thread to continue` })
    }
}