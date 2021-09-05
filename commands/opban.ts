import { CommandInteraction, MessageEmbed, ThreadChannel } from "discord.js";
import api from "../api/api";
import { getGameEmbedButtons, getLoadingButton } from "../managers/buttonManager";
import { createGameEmbed } from "../managers/embedManager";
import { rollPicks, sendPicks } from "../managers/rollManager";
import { ICivilization, IFullGame } from "../types/api";
import { IGameUpdateArgs, IPlayerStateUpdateArgs } from "../types/apiReqs";
import { uniqueFilter } from "../util/arrays";
import { aliasToCivs, combineAliases, findSimilar, isEnoughCivsToStartGame } from "../util/civlist";
import { findGame } from "../util/games";
import { combineImages } from "../util/image";
import { findGameMessage } from "../util/messages";
import { updatePicksInfo } from "../util/picks";

export default {
    name: 'opban',
    execute: async (interaction: CommandInteraction) => {
        const aliases = [
            interaction.options.getString('civ', true)
        ].filter(x => x !== null) as string[]
        const game = await findGame({
            threadId: interaction.channelId,
            guildId: interaction.guildId,
        })
        if (!interaction.guild || !interaction.channel?.isThread() || !game)
            return await interaction.reply({ content: `This command can only be used in game threads created with \`/start\` command`, ephemeral: true })
        if (game.opId !== interaction.user.id && interaction.user.id !== process.env.BOT_OWNER_ID)
            return interaction.reply({ content: `Only game operator can use this command`, ephemeral: true })
        if (game.phase !== `ban`)
            return await interaction.reply({ content: `This command can only be used during bans phase`, ephemeral: true })
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
            if (!isEnoughCivsToStartGame(game, true))
                return await interaction.reply({ content: `Can't op ban more civs. Reached minimum civs amount required to proceed to picks phase`, ephemeral: true })
            const civs = results.map(x => x.civ as ICivilization)
            const civIds = civs.map(x => x.id)
            const newCivs = game.state.civs.filter(x => !civIds.includes(x))
            const newBanned = [...game.state.banned, ...civIds]
            let newGame = await api.patch(`/game/${game.id}`, {
                cpp: game.cpp,
                gameState: {
                    civs: newCivs,
                    banned: newBanned,
                }
            })

            await combineImages(civs.map(x => `./assets/${x.thumbnailPath}`), `./assets/imgs/bans/${game.gameName}${civIds.join(`-`)}.png`)
            await interaction.reply({
                content: `OP Banned ${results.map(x => x.message).join(`, `)}`,
                files: [`./assets/imgs/bans/${game.gameName}${civIds.join(`-`)}.png`]
            })
            const gameMessage = await findGameMessage(interaction.channelId as string, game.state.msgId)
            await gameMessage.edit({ embeds: [createGameEmbed(newGame)], components: getGameEmbedButtons(newGame) })
            return
        }
        else {
            return await interaction.reply({
                content: `Ban failed:\n${results.map(res => {
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