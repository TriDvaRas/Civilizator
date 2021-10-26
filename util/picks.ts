import api from "../api/api";
import { IPick } from "../managers/rollManager";
import { IFullGame } from "../types/api";
import { IGameUpdateArgs, IPlayerStateUpdateArgs } from "../types/apiReqs";
import { IPickMsg } from "../types/custom";

export async function updatePicksInfo(game: IFullGame, pickMsgs: IPickMsg[], picks: IPick[]) {
    await Promise.all([
        api.patch(`/game/${game.id}`, {
            phase: 'pick',
            gameState: {
                pickIds: pickMsgs
            }
        } as IGameUpdateArgs),
        ...picks.map(async (pick: IPick) => {
            return api.patch(`/playerstate/${game.id}/${pick.player.playerId}`, {
                rolled: pick.civs.map(x => x.id)
            } as IPlayerStateUpdateArgs)
        })
    ])
    return await api.patch(`/playerstate/${game.id}/all`, {
        vote: false,
        picked: null,
    } as IPlayerStateUpdateArgs) as IFullGame;
}