import { MessageEmbed } from "discord.js";
import { ICivilization, IFullGame, IGuild, IPlayerState } from "../types/api";
import { GameSettingsType, GuildSettingsType } from "../types/custom";
import { getCivName, isEnoughCivsToStartGame } from "../util/civlist";

export function createBaseGameEmbed() {
    return new MessageEmbed()
        .setColor(`#46a832`)
        .setTitle("**Civilizator Game**")
        // .setDescription("**[Civilizations List](https://docs.google.com/spreadsheets/d/e/2PACX-1vR5u67tm62bbcc5ayIByMOeiArV7HgYvrhHYoS2f84m0u4quPep5lHv9ghQZ0lNvArDogYdhuu1_f9b/pubhtml)**")
        .addField(`Starting game...`, `\u200B`)
        .setFooter(`Civilizator by TriDvaRas#4805`, `https://tdr.s-ul.eu/hP8HuUCR`);
}
export function createGameEmbed(game: IFullGame) {
    return setFields(
        new MessageEmbed()
            .setColor(getEmbedColor(game.phase))
            .setTitle(`**Civilizator Game \#${game.id}**`)
            .setFooter(`Civilizator by TriDvaRas#4805`, `https://tdr.s-ul.eu/hP8HuUCR`)
        , game)
}
export function createGameSetEmbed(game: IFullGame, type: GameSettingsType) {
    const embed = new MessageEmbed()
        .setColor(`#807BC5`)
        .setTitle(`Civilizator Game \#${game.id} Settings`)
        .setDescription(`Click *Dismiss message* to hide this menu`)
    switch (type) {
        case `menu`:
            embed.setTitle(`Choose which setting you want to update`)
            break;
        case `game`:
            embed.setTitle(`Choose game`)
            break;
        case `cpp`:
            embed.setTitle(`Choose cpp value`)
            break;
        case `bpp`:
            embed.setTitle(`Choose bpp value`)
            break;
        case `dlc`:
            embed.setTitle(`Click DLC to toggle (green - enabled)`)
            break;
        case `wrongphase`:
            embed.setTitle(`You can edit game settings only during **Join** phase`)
            break;
        case `wrongop`:
            embed.setTitle(`You are no longer this game's operator`)
            break;
        default:
            break;
    }
    return embed
}

function getPlayerTags(playerStates: IPlayerState[]) {
    return playerStates.map(ps => `<@${ps.playerId}>`).join(`\n`)
}
function getPlayerBans(playerStates: IPlayerState[], bpp: number) {
    return playerStates.map(ps => `[${ps.banned.length || 0}/${bpp}]`).join(`\n`)
}
function getPlayerPicks(playerStates: IPlayerState[], civlist: ICivilization[]) {
    return playerStates.map(ps => ps.picked ? `${getCivName(civlist, ps.picked)}` : `-`).join(`\n`)
}
function getGameName(game?: string) {
    switch (game) {
        case `civ5`:
            return `Civilization V`
        case `lek`:
            return `Civilization V + LEK`
        case `civ6`:
            return `Civilization VI`
        default:
            return `Unknown`
    }
}
function getPhaseName(game?: string) {
    switch (game) {
        case `join`:
            return `Join`
        case `ban`:
            return `Bans`
        case `pick`:
            return `Picks`
        default:
            return `Unknown`
    }
}
function getEmbedColor(phase?: string) {
    switch (phase) {
        case `join`:
            return `#6ca645`
        case `ban`:
            return `#c1491d`
        case `pick`:
            return `#7fdbd0`
        default:
            return `#6D23C1`
    }
}
function setFields(embed: MessageEmbed, game: IFullGame) {
    const dlcString = `${game.state.dlcs?.length || 0}/${(game.state.disabledDlcs?.length || 0) + (game.state.dlcs?.length || 0)} enabled`
    switch (game.phase) {
        case `join`:
            embed.addFields(
                { name: `Game Operator`, value: `<@${game.opId}>`, inline: true },
                { name: `Game`, value: `${getGameName(game.gameName)}\u200B`, inline: true },
                { name: `Game Phase`, value: `${getPhaseName(game.phase)}\u200B`, inline: true },
                { name: `DLCs`, value: `${dlcString}\u200B`, inline: true },
                { name: `Civs per player`, value: `${game.cpp}\u200B`, inline: true },
                { name: `Bans per player`, value: `${game.bpp}\u200B`, inline: true },
                { name: `Players`, value: `${getPlayerTags(game.playerStates)}\u200B`, inline: true },
                { name: `Tips\u200B`, value: `Use \`/set\` to edit game settings\nUse \`/dlcs\` to view dlcs info`, inline: false },
            )
            if (!isEnoughCivsToStartGame(game))
                embed.addField(`**Not enough civs to proceed**`, `\`${game.state.civs.length}\` civs in pool, \`${(game.bpp + game.cpp) * game.playerStates.length}\` is needed\nLower cpp, bpp or enable more dlcs`)
            break;
        case `ban`:
            embed.addFields(
                { name: `Game Operator`, value: `<@${game.opId}>`, inline: true },
                { name: `Game`, value: `${getGameName(game.gameName)}\u200B`, inline: true },
                { name: `Game Phase`, value: `${getPhaseName(game.phase)}\u200B`, inline: true },
                { name: `DLCs`, value: `${dlcString}\u200B`, inline: true },
                { name: `Civs per player`, value: `${game.cpp}\u200B`, inline: true },
                { name: `Bans per player`, value: `${game.bpp}\u200B`, inline: true },
                { name: `Players`, value: `${getPlayerTags(game.playerStates)}\u200B`, inline: true },
                { name: `Bans`, value: `${getPlayerBans(game.playerStates, game.bpp)}\u200B`, inline: true },
            )
            break;
        case `pick`:
            embed.addFields(
                { name: `Game Operator`, value: `<@${game.opId}>`, inline: true },
                { name: `Game`, value: `${getGameName(game.gameName)}\u200B`, inline: true },
                { name: `Game Phase`, value: `${getPhaseName(game.phase)}\u200B`, inline: true },
                { name: `DLCs`, value: `${dlcString}\u200B`, inline: true },
                { name: `Civs per player`, value: `${game.cpp}\u200B`, inline: true },
                { name: `Bans per player`, value: `${game.bpp}\u200B`, inline: true },
                { name: `Players`, value: `${getPlayerTags(game.playerStates)}\u200B`, inline: true },
                { name: game.bpp > 0 ? `Bans` : `\u200B`, value: `${game.bpp > 0 ? getPlayerBans(game.playerStates, game.bpp) : ``}\u200B`, inline: true },
                { name: `Pick`, value: `${getPlayerPicks(game.playerStates, game.civlist)}\u200B`, inline: true },
                { name: `Reroll Votes [${game.playerStates.filter(x => x.vote).length}/${Math.ceil(game.playerStates.length * game.guildConfig.rerollThreshold / 100)}]`, value: `${getRerollVotes(game.playerStates)}\u200B`, inline: true },
                { name: `Tips`, value: `OP can resend this message with \`/gm\` command\nIf every player submits their pick \`/winner\` command can be used\u200B`, inline: false },
            )
            break;
        default:
            embed.addFields({ name: `?`, value: `)`, inline: true })
            log.warn(`Invalid game phase in embedManager: ${game.phase}`);
            break;

    }
    return embed

}
function getRerollVotes(playerStates: IPlayerState[]) {
    return playerStates.filter(x => x.vote).map(x => `<@${x.playerId}>`).join(`  `)
}
export function createPickSelectEmbed(game: IFullGame, playerState: IPlayerState) {
    const embed = new MessageEmbed()
        .setColor(`#807BC5`)
        .setTitle(`Pick Selector`)
        .setDescription(`Click *Dismiss message* to hide this menu`)

    return embed
}


export function createSettingsEmbed(guildConfig: IGuild, type: GuildSettingsType) {
    const embed = new MessageEmbed()
        .setColor(`#807BC5`)
        .setTitle(`Civilizator Settings`)
        .setDescription(`Click *Dismiss message* to hide this menu`)
    switch (type) {
        case `menu`:
            embed.setTitle(`Choose settings group you want to update`)
            break;
        case `reroll`:
            embed.setTitle(`Reroll Settings`)
            getVotesPlayers(embed, guildConfig.rerollThreshold)
            break;
        case `news`:
            embed.setTitle(`News Settings`)
            embed.addField(`About`, `Bot sends info about major updates once in few months. You can specify channels in which info would be sent. If no channels are specified info would be sent in channel where \`/start\` was last used. You can also fully disable news.`)
            embed.addField(`News Channels`, `In which channels news would be sent:\n${guildConfig.news ? (guildConfig.newsChannels.length === 0 ? `**_In last game's channel_**` : guildConfig.newsChannels.map(x => `<#${x}>`).join(` `)) : `**News Disabled**`}\n Use \`/news\` to change\n\u200B`)
            break;
        case `locale`:
            embed.setTitle(`Alias Locales Settings`)
            embed.addField(`About`, `WIP feature, don't expect it to be fully functional. If you want to contribute with adding locales please message ${process.env.BOT_OWNER_TAG}\n`)
            break;
        case `permissions`:
            embed.setTitle(`Permissions Settings`)
            embed.addField(`Channels`, `In which channels can \`/start\` and \`/fast\` be used:\n${guildConfig.whiteChannels.length === 0 ? `**_In all_**` : guildConfig.whiteChannels.map(x => `<#${x}>`).join(` `)}\n Use \`/permissions c\` to change\n\u200B`)
            embed.addField(`Roles`, `Which roles can use \`/start\` and \`/fast\`:\n${guildConfig.whiteRoles.length === 0 ? `@everyone` : guildConfig.whiteRoles.map(x => `<@&${x}>`).join(` `)}\n Use \`/permissions r\` to change\n\u200B`)
            embed.addField(`Privileged Users`, `Which users (other than server admins) can use \`/settings\` and \`/permissions\`:\n${guildConfig.privilegedUsers.length === 0 ? `**_None_**` : guildConfig.privilegedUsers.map(x => `<@${x}>`).join(` `)}\n Use \`/permissions pu\` to change`)
            break;

    }
    return embed
}


function getVotesPlayers(embed: MessageEmbed, threshold: number) {
    embed.addField(`Current threshold`, threshold > 0 ? `${threshold}%` : `Rerolls disabled`, false);
    if (threshold < 0)
        return
    let i = 1
    embed.addField(`\u200B`, `${new Array(7).fill(0)
        .map(() => i++)
        .map(x => `${Math.ceil(x * threshold / 100)}/${x}`)
        .join(`\n`)
        }`, true);
    embed.addField(`\u200B`, `${new Array(7).fill(0)
        .map(() => i++)
        .map(x => `${Math.ceil(x * threshold / 100)}/${x}`)
        .join(`\n`)
        }`, true);
    embed.addField(`\u200B`, `\u200B\n${new Array(6).fill(0)
        .map(() => i++)
        .map(x => `${Math.ceil(x * threshold / 100)}/${x}`)
        .join(`\n`)
        }`, true);
    embed.setFooter(`Votes required/Total players`)
}