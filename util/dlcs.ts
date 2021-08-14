export function sortDlcs(dlcs: { name: string, enabled: boolean }[]) {
    return dlcs.sort((a, b) => {
        if (a.name === 'Vanilla') return -2
        if (b.name === 'Vanilla') return 2
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
    })
}