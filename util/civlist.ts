import { AliasLanguages, ICivilization, IFullGame } from "../types/api";
import { findBestMatch } from "string-similarity";

export function getDlcNames(civs: ICivilization[]) {
    const dlcs = civs.map(c => c.dlc)
    const f = dlcs.filter((c, i, cs) => cs.indexOf(c) === i)

    return f
}
export function getCivName(civs: ICivilization[], civId: number) {
    return civs.find(c => c.id === civId)?.name || `Unknown Civ`
}
export function filterPersonas(enable: boolean, civlist: ICivilization[], disabled: number[] = []): [number[], number[]] {
    if (civlist[0].game !== 'civ6')
        return [civlist.map(x => x.id), []]
    const civs = civlist.filter(x => !disabled.includes(x.id) && (!x.personaId || (enable !== (x.personaId === x.id)))).map(x => x.id)
    const _disabled = civlist.filter(x => !civs.includes(x.id)).map(x => x.id)
    return [civs, _disabled]
}
export function filterDlcs(dlcs: string[], civlist: ICivilization[], disabled: number[] = []): [number[], number[]] {

    const civs = civlist.filter(x => !disabled.includes(x.id) && (dlcs.includes(x.dlc))).map(x => x.id)
    const _disabled = civlist.filter(x => !civs.includes(x.id)).map(x => x.id)
    return [civs, _disabled]
}
export function aliasToCivs(alias: string, civlist: ICivilization[], locales: AliasLanguages[]) {
    return civlist.filter(civ => {
        if (alias === `${civ.id}`)
            return true
        for (const loc of locales)
            if (civ.aliases[loc] && civ.aliases[loc].find(x => x.toLowerCase().includes(alias.toLowerCase())))
                return true
        return false
    })
}
export function combineAliases(aliases: { [key in AliasLanguages]: string[] }, locales: AliasLanguages[]) {
    const arr: string[] = []
    for (const locale of locales) {
        if (aliases[locale])
            arr.push(...aliases[locale])
    }
    return arr
}
export function findSimilar(alias: string, civlist: ICivilization[], locales: AliasLanguages[]) {
    let matches = findBestMatch(alias, civlist.map(x => {
        let a = []
        for (const loc of locales)
            if (x.aliases[loc])
                a.push(x.aliases[loc])
        return a
    }).flat(3))
    return matches.ratings.filter(x => x.rating > 0.3).sort((a, b) => b.rating - a.rating).slice(0, 2).map(x => x.target).filter((x, i, arr) => arr.indexOf(x) == i)
}

export function isEnoughCivsToStartGame(game: IFullGame, extraSlot?: boolean) {
    const civsRequired = (game.bpp + game.cpp) * game.playerStates.length
    const civsAvailable = game.state.civs.length + game.playerStates.reduce((a, c) => a + c.banned.length, 0)

    if (extraSlot)
        return civsAvailable > civsRequired
    return civsAvailable >= civsRequired
}