import api from "../api/api";
import { IPressence } from "../types/api";

// let pressences: IPressence[] = []
let i = 0
export async function nextPresence() {
    const pressences: IPressence[] = await api.get(`/presence`) || []
    const stats = await api.get(`/presencestats`)
    const p = pressences[i]
    i = (i + 1) % pressences.length
    client.user?.setPresence({
        activities: [{
            name: p.text.replace(`{guildCount}`, stats.guilds)
                .replace(`{playersCount}`, stats.players)
                .replace(`{gamesCount}`, stats.games)
                .replace(`{buttonsCount}`, stats.buttons)
                .replace(`{commandsCount}`, stats.commands)
                .replace(`{fastCount}`, stats.fasts),
            type: p.type as any
        }]
    })


}