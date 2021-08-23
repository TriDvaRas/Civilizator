import { MessageActionRow, MessageButton } from "discord.js";
import { IFullGame } from "../types/api";
import { GameSettingsType } from "../types/custom";
import { sortDlcs } from "../util/dlcs";
import { IPick } from "./rollManager";

export function getGameEmbedButtons(game: IFullGame): MessageActionRow[] {
    const rows: MessageActionRow[] = []
    switch (game.phase) {
        case `join`:
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`join-join`)
                        .setLabel(`Join`)
                        .setStyle(`SUCCESS`)
                        .setEmoji(`civilizatorTick:875078196050141185`),
                    new MessageButton()
                        .setCustomId(`join-leave`)
                        .setLabel(`Leave`)
                        .setStyle(`DANGER`)
                        .setEmoji(`civilizatorCross:875078196444405780`),
                    new MessageButton()
                        .setCustomId(`join-op-next`)
                        .setLabel(`Start ${game.bpp > 0 ? `bans` : `picks`} (op)`)
                        .setStyle(`SUCCESS`)
                        .setEmoji(`civilizatorNext:875082717606338690​`),
                ))
            break;
        case `ban`:
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`ban-skip`)
                        .setLabel(`Skip 1 ban`)
                        .setStyle(`SECONDARY`)
                        .setEmoji(`civilizatorR:875295229845049374`),
                    new MessageButton()
                        .setCustomId(`ban-skip-all`)
                        .setLabel(`Skip all bans`)
                        .setStyle(`SECONDARY`)
                        .setEmoji(`civilizatorRR:875295230147067904`),
                    new MessageButton()
                        .setCustomId(`ban-op-next`)
                        .setLabel(`Start picks (op)`)
                        .setStyle(`SUCCESS`)
                        .setEmoji(`civilizatorNext:875082717606338690​`),
                ))
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel(`Civilizations List`)
                        .setStyle(`LINK`)
                        .setURL(`${process.env.CIVLIST_URL}`),//TODO change to better one
                ))
            break;
        case `pick`:
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`pick-vote`)
                        .setLabel(`Vote for Reroll`)
                        .setStyle(`PRIMARY`)
                        .setEmoji(`civilizatorRe:875297793995059220`),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`pick-vote-cancel`)
                        .setLabel(`Cancel Vote`)
                        .setStyle(`SECONDARY`)
                        .setEmoji(`civilizatorReC:875306900579827742​`),
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`pick-show-select-menu`)
                        .setLabel(`Submit My Pick`)
                        .setStyle(`SUCCESS`)
                        .setEmoji(``),
                ))
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`pick-op-lock-rerolls`)
                        .setLabel(`Lock Rerolls (op)`)
                        .setStyle(`DANGER`)
                        .setEmoji(`🔒`),
                ))
            break;
        default:
            log.warn(`Invalid game phase in buttonManager: ${game.phase}`);
            break;
    }
    return rows
}
export function getGameSetButtons(game: IFullGame, type: GameSettingsType): MessageActionRow[] {
    const rows: MessageActionRow[] = []
    switch (type) {
        case `wrongphase`:
        case `wrongop`:
            return rows
        case `menu`:
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`set-menu-select/game`)
                        .setLabel(`Game`)
                        .setStyle(`SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-menu-select/cpp`)
                        .setLabel(`CPP`)
                        .setStyle(`SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-menu-select/bpp`)
                        .setLabel(`BPP`)
                        .setStyle(`SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-menu-select/dlc`)
                        .setLabel(`DLCs`)
                        .setStyle(`SECONDARY`)
                        .setEmoji(``),
                ))
            break;
        case `cpp`:
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`set-cpp-select/1`)
                        .setLabel(`1`)
                        .setStyle(game.cpp === 1 ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-cpp-select/2`)
                        .setLabel(`2`)
                        .setStyle(game.cpp === 2 ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-cpp-select/3`)
                        .setLabel(`3`)
                        .setStyle(game.cpp === 3 ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                ))
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`set-cpp-select/4`)
                        .setLabel(`4`)
                        .setStyle(game.cpp === 4 ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-cpp-select/5`)
                        .setLabel(`5`)
                        .setStyle(game.cpp === 5 ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-cpp-select/6`)
                        .setLabel(`6`)
                        .setStyle(game.cpp === 6 ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                ))
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`set-menu`)
                        .setLabel(`Back `)
                        .setStyle(`SECONDARY`)
                        .setEmoji(`civilizatorL:875782163281346632`),

                ))
            break;
        case `bpp`:
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`set-bpp-select/0`)
                        .setLabel(`0`)
                        .setStyle(game.bpp === 0 ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-bpp-select/1`)
                        .setLabel(`1`)
                        .setStyle(game.bpp === 1 ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-bpp-select/2`)
                        .setLabel(`2`)
                        .setStyle(game.bpp === 2 ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-bpp-select/3`)
                        .setLabel(`3`)
                        .setStyle(game.bpp === 3 ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-bpp-select/4`)
                        .setLabel(`4`)
                        .setStyle(game.bpp === 4 ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                ))
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`set-menu`)
                        .setLabel(`Back `)
                        .setStyle(`SECONDARY`)
                        .setEmoji(`civilizatorL:875782163281346632`),

                ))
            break;
        case `dlc`:
            const dlcs = sortDlcs([
                ...game.state.dlcs.map(x => ({ name: x, enabled: true })),
                ...game.state.disabledDlcs.map(x => ({ name: x, enabled: false }))
            ])
            const r = dlcs.length > 12 ? 4 : 3
            const c = Math.ceil(dlcs.length / r)
            for (let i = 0; i < r; i++) {
                const rowdlcs = dlcs.slice(i * c, i * c + c)

                rows.push(new MessageActionRow()
                    .addComponents(rowdlcs.map(dlc => new MessageButton()
                        .setCustomId(`set-dlc-select/${dlc.name}/${!dlc.enabled}`)
                        .setLabel(dlc.name)
                        .setStyle(dlc.enabled ? `SUCCESS` : `SECONDARY`)
                    )))
            }
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`set-menu`)
                        .setLabel(`Back `)
                        .setStyle(`SECONDARY`)
                        .setEmoji(`civilizatorL:875782163281346632`),
                    new MessageButton()
                        .setCustomId(`set-dlc-all`)
                        .setLabel(`Enable all`)
                        .setStyle(game.state.disabledDlcs.length === 0 ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-dlc-none`)
                        .setLabel(`Disable all`)
                        .setStyle(game.state.dlcs.length === 0 ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                ))
            break;
        case `game`:
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`set-game-select/civ5`)
                        .setLabel(`Civ V`)
                        .setStyle(game.gameName === 'civ5' ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-game-select/lek`)
                        .setLabel(`Civ V LEK `)
                        .setStyle(game.gameName === 'lek' ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),
                    new MessageButton()
                        .setCustomId(`set-game-select/civ6`)
                        .setLabel(`Civ VI `)
                        .setStyle(game.gameName === 'civ6' ? `SUCCESS` : `SECONDARY`)
                        .setEmoji(``),

                ))
            rows.push(new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`set-menu`)
                        .setLabel(`Back `)
                        .setStyle(`SECONDARY`)
                        .setEmoji(`civilizatorL:875782163281346632`),

                ))
            break;
        default:
            log.warn(`Invalid game phase in buttonManager: ${game.phase}`);
            break;
    }
    return rows
}
export function getPickButtons(pick: IPick) {

}
export function getLoadingButton(customText?: string) {
    return new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(`disabled-button`)
                .setLabel(customText || `Loading...`)
                .setStyle(`SECONDARY`)
                .setDisabled(true)
        )
}