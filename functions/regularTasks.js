/* global discordClient  logger chalk activeGames */
const db = require("./db");
let pressences = []

function updatePressence() {
    if (pressences.length == 0)
        db.getPressences().then(pres => {
            pressences = pres
            updatePressence()
        })
    else {
        db.getStats().then(stats => {
            let act = pressences.shift();
            act.text = act.text.replace(`{guildCount}`, stats.guilds)
                .replace(`{playersCount}`, stats.players)
                .replace(`{gamesCount}`, stats.games)
                .replace(`{fastCount}`, stats.fasts)

            discordClient.user.setPresence({
                activity: {
                    name: act.text,
                    type: act.type
                }
            })
        })

    }
}


function flushGames(force) {
    logger.log(`info`, `Flushing old games`)
    global.activeGames.forEach((ag, key) => {
        let check = Date.now() - ag.startedAt > global.gameMaxTime || Date.now() - ag.lastActiveAt > global.gameMaxIdle || force
        logger.log(`debug`, `Checks: ${Date.now() - ag.startedAt} > ${global.gameMaxTime} | ${Date.now() - ag.lastActiveAt} > ${global.gameMaxIdle} | ${force} | ${check}`)
        if (check) {
            ag.collectors.forEach(coll => coll.stop(`game flushed`))
            activeGames.delete(key)
            db.statesCache.get(key)?.setFlushed()
            logger.log(`info`, `Flushed ${key}`)
        }
    })
}
function updateDaily() {
    db.updateDaily()
}
function getUptime() {
    let ms = discordClient.uptime;
    let s = Math.floor(ms / 1000) % 60;
    let m = Math.floor(ms / 60000) % 60;
    let h = Math.floor(ms / 3600000);
    return `${h.toString().length == 1 ? `0${h}` : h}:${m.toString().length == 1 ? `0${m}` : m}:${s.toString().length == 1 ? `0${s}` : s}`
}


module.exports = {
    flushGames,
    updatePressence,
    updateDaily,
}