import { CommandInteraction, MessageEmbed, ThreadChannel } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons, getLoadingButton } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { rollPicks, sendPicks } from "../managers/rollManager";
import { ICivilization, IFullGame } from "../types/api";
import { IGameUpdateArgs, IPlayerStateUpdateArgs } from "../types/apiReqs";
import { uniqueFilter } from "../util/arrays";
import { aliasToCivs, combineAliases, findSimilar } from "../util/civlist";
import { findGame } from "../util/games";
import { combineImages } from "../util/image";
import { findGameMessage } from "../util/messages";
import { updatePicksInfo } from "../util/picks";

export default {
    name: 'ban',
    execute: async (interaction: CommandInteraction) => {
        const aliases = [
            interaction.options.getString('civ1', true),
            interaction.options.getString('civ2', false) || null,
            interaction.options.getString('civ3', false) || null
        ].filter(x => x !== null) as string[]
        const game = await findGame({
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (!interaction.guild || !interaction.channel?.isThread() || !game)
            return await interaction.reply({ content: `This command can only be used in game threads created with \`/start\` command`, ephemeral: true })
        const playerState = game.playerStates.find(x => x.playerId === interaction.user.id)
        if (!playerState)
            return interaction.reply({ content: `You are not this game's player`, ephemeral: true })
        if (game.phase !== `ban`)
            return await interaction.reply({ content: `This command can only be used during bans phase`, ephemeral: true })
        const playerBans = playerState.banned
        if (playerBans.length >= game.bpp)
            return await interaction.reply({ content: `You have no bans left`, ephemeral: true })
        if (game.bpp - playerBans.length < aliases.length)
            return await interaction.reply({ content: `You've specified ${aliases.length} civs to ban but only have ${game.bpp - playerBans.length} bans left. Please lower the amount of arguments`, ephemeral: true })
        const newBans = aliases.map(a => ({
            alias: a,
            civs: aliasToCivs(a, game.civlist, game.guildConfig.locales).filter(uniqueFilter),
        }))
        const results: {
            err: boolean;
            alias: string;
            civ?: ICivilization;
            message: string;
        }[] = []
        //ban checks
        for (const ban of newBans) {
            if (ban.civs.length > 1) {
                const top10 = ban.civs.slice(0, 10)
                results.push({
                    err: true,
                    alias: ban.alias,
                    message: `To many civs found for ${ban.alias}:\n${top10.map(x => `${x.id}. ${x.name} - ${combineAliases(x.aliases, game.guildConfig.locales).join(`, `)}`).join(`\n`)} ${ban.civs.length > 10 ? `\nand ${ban.civs.length - 10} more...` : ``}`,
                })
            }
            else if (ban.civs.length === 1) {
                const civ = ban.civs[0]
                if (game.state.banned.includes(civ.id))
                    results.push({
                        err: true,
                        alias: ban.alias,
                        message: `${civ.name} is already banned`,
                    })
                else if (game.state.disabled.includes(civ.id))
                    results.push({
                        err: true,
                        alias: ban.alias,
                        message: `${civ.name} is already disabled by DLC settings`,
                    })
                else {
                    results.push({
                        err: false,
                        alias: ban.alias,
                        civ,
                        message: `${civ.name}`,
                    })
                }
            } else {
                const sim = findSimilar(ban.alias, game.civlist, game.guildConfig.locales)
                results.push({
                    err: true,
                    alias: ban.alias,
                    message: `No civs found for ${ban.alias} ${sim?.length > 0 ? `. Similar aliases: \`${sim.join('`, `')}\`` : ``}`,
                })
            }
        }
        if (!results.find(x => x.err)) {
            const civs = results.map(x => x.civ as ICivilization)
            const civIds = civs.map(x => x.id)
            const newCivs = game.state.civs.filter(x => !civIds.includes(x))
            const newBanned = [...game.state.banned, ...civIds]
            const newPsBanned = [...playerBans, ...civIds]
            await api.patch(`/game/${game.id}`, {
                cpp: game.cpp,
                gameState: {
                    civs: newCivs,
                    banned: newBanned,
                }
            })
            let newGame = await api.patch(`/playerstate/${game.id}/${interaction.user.id}`, {
                banned: newPsBanned
            } as IPlayerStateUpdateArgs) as IFullGame

            await combineImages(civs.map(x => `./assets/${x.thumbnailPath}`), `./assets/imgs/bans/${game.gameName}${civIds.join(`-`)}.png`)
            await interaction.reply({
                content: `Banned ${results.map(x => x.message).join(`, `)}`,
                files: [`./assets/imgs/bans/${game.gameName}${civIds.join(`-`)}.png`]
            })
            const gameMessage = await findGameMessage(interaction.channelId as string, game.state.msgId)
            if (newGame.playerStates.find(x => x.banned.length && x.banned.length < game.bpp)) {
                await gameMessage.edit({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
            }
            else {
                await gameMessage.edit({ embeds: [createGameEmbed(newGame)], components: [getLoadingButton(`Rolling...`)] })
                const picks = rollPicks(game)
                const pickMsgs = await sendPicks(game, picks, interaction.channel as ThreadChannel, game.state.pickIds)
                newGame = await updatePicksInfo(game, pickMsgs, picks);

                await gameMessage.edit({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
            }
            return
        } else {
            return await interaction.reply({
                content: `Some of the bans failed:\n${results.map(res => {
                    if (res.err)
                        return `\`${res.alias}\` - ERROR: \n${res.message}`
                    else
                        return `\`${res.alias}\` - OK: Can ban ${res.message}`
                }).join(`\n\n`)}`,
                ephemeral: true,
            })
        }

    }
}