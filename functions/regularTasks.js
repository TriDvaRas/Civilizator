const IO = require('./IO');
const sheet = require(`./sheet`);
const GC = require("./guildConfig.js");
const db = require("./db");
let pressences = IO.Read(`./pressence.json`);
const logger = require("../logger");

let pressenceReps = new Map()
    .set(`{guildCount}`, (val, stats) => val.replace(`{guildCount}`, `${discordClient.guilds.cache.size}`))
    .set(`{gamesCount}`, (val, stats) => val.replace(`{gamesCount}`, `${stats.gameCount}`))
    .set(`{fastCount}`, (val, stats) => val.replace(`{fastCount}`, `${stats.fastCount}`))
    .set(`{uptime}`, (val, stats) => val.replace(`{uptime}`, `${getUptime()}`))
    .set(`{civilizedCount}`, (val, stats) => val.replace(`{civilizedCount}`, `${stats.userCount}`))

function updatePressence() {
    if (pressences.length == 0)
        pressences = IO.Read(`./pressence.json`);

    let act = pressences.shift();
    let stats = IO.Read(`./stats.json`);

    act.reps.forEach(key => {
        act.name = pressenceReps.get(key)(act.name, stats)
    })

    global.discordClient.user.setPresence({
        activity: {
            name: act.name,
            type: act.type
        }
    })
}

function updateSheetStats() {
    let stats = IO.Read(`./stats.json`);
    let date = new Date(Date.now())
    sheet.SubmitStats({
        date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
        guilds: global.discordClient.guilds.cache.size,
        games: stats.gameCount,
        fasts: stats.fastCount,
        civilized: stats.userCount
    })
}
function updateLocalStats() {
    let stats = {}
    getCivilizedCount().then(count => {
        stats[`userCount`] = count;
        db.getStats().then(doc => {
            stats[`gameCount`] = doc.lastGameId;
            stats[`fastCount`] = doc.globalFastCount;
            IO.Write(`./stats.json`, stats);
        })

    })
}
function updateSheetGames() {
    db.getUnsynced().then(res => {
        logger.log(`info`, `Synced new games: ${res?.join(`\n`)}`)
    })
}


function flushGames(force) {
    logger.log(`info`, `Flushing old games`)
    global.activeGames.forEach((ag, key) => {
        let check = Date.now() - ag.startedAt > global.gameMaxTime || Date.now() - ag.lastActiveAt > global.gameMaxIdle || force
        logger.log(`debug`,`Checks: ${Date.now() - ag.startedAt} > ${global.gameMaxTime} | ${Date.now() - ag.lastActiveAt} > ${global.gameMaxIdle} | ${force} | ${check}`)
        if (check) {
            ag.collectors.forEach(coll => coll.stop(`game flushed`))
            global.activeGames.delete(key)
            db.setFlushed(key)
            logger.log(`info`, `Flushed ${key}`)
        }
    })
}

function updateMinCivilized() {
    return new Promise((resolve, reject) => {
        logger.log(`debug`, `Updating minCivCount...`)
        let Qs = [];
        logger.log(`debug`, `Guilds: ${discordClient.guilds.cache.size}`)
        discordClient.guilds.cache.each(guild => {
            Qs.push(new Promise((res, reject) => {
                guild.members.fetch().then(() => {
                    GC.getConfig(guild).then(cfg => {
                        if (!cfg)
                            return res(0)
                        guild.roles.fetch(cfg.roleId).then(role => {
                            if (!role)
                                return res(0)
                            res(role.members.size)
                        })
                    },
                        err => logger.log(`error`, `${err}`)
                    );
                })
            }))
        });
        Promise.all(Qs).then(values => {
            let sum = 0;
            values.forEach(v => sum += v);
            global.minCivilizedCount = sum
            logger.log(`debug`, `Finished minCivCount: ${values.join(`, `)} = ${sum}`)
            resolve()
        });
    })
}

function getUptime() {
    let ms = discordClient.uptime;
    let s = Math.floor(ms / 1000) % 60;
    let m = Math.floor(ms / 60000) % 60;
    let h = Math.floor(ms / 3600000);
    return `${h.toString().length == 1 ? '0' + h : h}:${m.toString().length == 1 ? '0' + m : m}:${s.toString().length == 1 ? '0' + s : s}`
}
function getCivilizedCount() {
    return new Promise((resolve, reject) => {
        let Qs = [];
        discordClient.guilds.cache.each(guild => {
            Qs.push(new Promise((res, reject) => {
                GC.getConfig(guild).then(cfg => {
                    if (!cfg)
                        return res(0)
                    role = guild.roles.cache.get(cfg.roleId)
                    if (!role)
                        return res(0)
                    res(role.members.size)
                },
                    err => logger.log(`error`, `${err}`)
                );
            }))



        });
        Promise.all(Qs).then(values => {
            let sum = 0;
            values.forEach(v => sum += v);
            resolve(Math.max(sum, global.minCivilizedCount));
        });
    })

}


module.exports = {
    updateSheetStats,
    updateLocalStats,
    updateSheetGames,
    flushGames,
    updatePressence,
    updateMinCivilized,
}