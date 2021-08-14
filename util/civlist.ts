import { ICivilization } from "../types/api";

export function getDlcNames(civs: ICivilization[]) {
    const dlcs = civs.map(c => c.dlc)
    const f = dlcs.filter((c, i, cs) => cs.indexOf(c) === i)

    return f
}
export function getCivName(civs: ICivilization[], civId:number) {
    return civs.find(c=>c.id===civId)?.name || `Unknown Civ`
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