import { Message, MessageAttachment, MessageOptions, Snowflake, ThreadChannel, User } from "discord.js";
import api from "../api/api";
import { GameTypes, ICivilization, IFullGame, IPlayerState } from "../types/api";
import { IGameUpdateArgs } from "../types/apiReqs";
import { IPickMsg } from "../types/custom";
import { combineImages } from "../util/image";
import { randFrom } from "../util/random";
export interface IPick { player: IPlayerState, civs: ICivilization[] }
export function rollPicks(game: IFullGame): IPick[] {
    const availableCivs = game.civlist.filter(x => game.state.civs.includes(x.id))
    const res: IPick[] = []
    const rolled: ICivilization[] = []
    for (const ps of game.playerStates) {
        const _rolled = []
        for (let i = 0; i < game.cpp; i++) {
            const civ = randFrom(availableCivs.filter(x => !rolled.includes(x)))
            _rolled.push(civ)
            rolled.push(civ)
        }
        res.push({
            player: ps,
            civs: _rolled,
        })
    }
    return res
}
export function getPicks(game: IFullGame) {
    const res: IPick[] = []
    for (const ps of game.playerStates) {
        const _rolled = game.civlist.filter(x => ps.rolled.includes(x.id))
        res.push({
            player: ps,
            civs: _rolled,
        })
    }
    return res
}
export async function createPicksMessage(pick: IPick) {
    const msg = {
        content: `<@${pick.player.playerId}>\n${pick.civs.map(x => x.name).join(`|`)}\u200B`,
        components: [],
    } as MessageOptions
    try {
        await combineImages(pick.civs.map(x => `./assets/${x.thumbnailPath}`), `./assets/imgs/players/${pick.player.playerId}.png`)
        msg.files = [new MessageAttachment(`./assets/imgs/players/${pick.player.playerId}.png`)]
    } catch (error) {
        log.warn(`mergeImg error\n${error}`)
        msg.content += `\n*Failed to create image*`
    }
    return {
        id: pick.player.playerId,
        messageData: msg
    }
}
export async function sendPicks(game: IFullGame, picks: IPick[], channel: ThreadChannel, oldMessages?: IPickMsg[]) {
    const messagesData = await Promise.all(picks.map(async (pick) => createPicksMessage(pick)))
    const pickMessages = await Promise.all(messagesData.map(async md => {
        if (oldMessages) {
            const msg = oldMessages.find(m => m.playerId === md.id)
            const message = msg ? await channel.messages.fetch(msg.id).catch(() => undefined) : undefined
            if (message) {
                if (!msg?.playerId)
                    message.delete()
                else
                    return message.edit({ ...md.messageData, attachments: [] })
            }
        }
        return channel?.send({ ...md.messageData })

    }))
    const pickMsgs: IPickMsg[] = pickMessages.map(msg => ({
        id: msg?.id,
        playerId: (msg?.mentions.users.first() as User)?.id || null
    }))

    return pickMsgs
}