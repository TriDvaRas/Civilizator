import { MessageEmbed } from "discord.js";
import { ICivilization, IFullGame, IGame, IPlayerState } from "../types/api";
import { GameSettingsType } from "../types/custom";
import { getCivName, getDlcNames } from "../util/civlist";

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
        .setFooter(`Click dismiss message to hide this menu`)
    switch (type) {
        case `menu`:
            embed.setTitle(`Choose which setting you want to update`)
            break;
        case `cpp`:
            embed.setTitle(`Choose new cpp value`)
            break;
        case `bpp`:
            embed.setTitle(`Choose new bpp value`)
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
    const dlcString = `Enabled: ${game.state.dlcs?.length || 0}\nDisabled: ${game.state.disabledDlcs?.length || 0}`
    // game.state.dlcs.length === 0 ? `None` :
    //     game.state.disabledDlcs.length === 0 ? `All` :
    //     game.state.dlcs.join('\n')
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
                { name: `Tip\u200B`, value: `You can use \`/set\` to edit game settings`, inline: false },
            )
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
            )
            break;
        default:
            embed.addFields({ name: `?`, value: `)`, inline: true })
            log.warn(`Invalid game phase in embedManager: ${game.phase}`);
            break;

    }
    return embed

}