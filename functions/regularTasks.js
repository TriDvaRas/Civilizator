const IO = require('./IO');
const sheet = require(`./sheet`);
const GC = require("./guildConfig.js");
const db = require("./db");
let pressences = IO.Read(`./pressence.json`);

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
    db.getUnsynced()
}


function flushGames() {
    global.activeGames.forEach((ag, key) => {
        if (Date.now() - ag.startedAt > global.gameMaxTime || Date.now() - ag.lastActiveAt > global.gameMaxIdle) {
            ag.collectors.forEach(coll=>coll.stop(`game flushed`))
            global.activeGames.delete(key)
            db.setFlushed(key)
        }
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
            Qs.push(new Promise((resolve, reject) => {
                GC.getConfig(guild).then(cfg => {
                    if (!cfg)
                        return resolve(0)
                    let roleId = cfg.roleId;
                    let sum = 0;
                    guild.members.cache.each(member => {
                        if (member.roles.cache.has(roleId))
                            sum++;
                    });
                    resolve(sum)
                },
                    err => logger.log(`error`, `${err}`)
                );
            }))



        });
        Promise.all(Qs).then(values => {
            let sum = 0;
            values.forEach(v => sum += v);
            resolve(sum);
        });
    })

}


module.exports = {
    updateSheetStats,
    updateLocalStats,
    updateSheetGames,
    flushGames,
    updatePressence
}