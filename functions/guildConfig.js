const IO = require('./IO.js');
const { createBase } = require('./Setup.js');
const logger = require(`../logger`);
const chalk = require('chalk');
const DB = require(`./db`);
const getBaseState = require(`../functions/baseState`)


function createConfig(guild) {
    return new Promise((resolve, reject) => {
        let config = {
            guildId: guild.id,
            guildName: guild.name,
            prefix: "!",
            roleId: "N/A",
            channelId: "N/A",
            allowGetRole: true,
            gameCount: 0,
            fastCount: 0,
            lastFast: 0
        }
        let state = getBaseState(`civ5`)
        state.guildId = guild.id;
        Promise.all([
            DB.addDoc(`guilds`, config),
            DB.addDoc(`states`, state)
        ])
            .then(() => resolve(),
                err => reject(err)
            )
    })


}

function initGuildEvents() {
    globalThis.discordClient.on('guildCreate', guild => {
        let logguild = discordClient.guilds.cache.array().find(g => g.id == `727081958823165963`);
        if (logguild)
            logguild.channels.cache.find(channel => channel.name == `guilds-log`).send(`Joined guild [${guild.id}] [${guild.name}]\n guildCount: ${discordClient.guilds.cache.array().length}`);
        logger.log(`info`, `[${chalk.magentaBright(guild.name)}] joined guild `);

        createConfig(guild)
            .then(() => {
                logger.log(`info`, `[${chalk.magentaBright(guild.name)}] created config`)
                createBase(guild)
                    .then(() => logger.log(`info`, `[${chalk.magentaBright(guild.name)}] created base `),
                        error => logger.log(`info`, `[${chalk.magentaBright(guild.name)}] failed creating base \n${error}`))
            },
                error => logger.log(`info`, `[${chalk.magentaBright(guild.name)}] failed creating config \n${error}`))




    })
    globalThis.discordClient.on('guildDelete', guild => {

        let logguild = discordClient.guilds.cache.array().find(g => g.id == `727081958823165963`);
        if (logguild)
            logguild.channels.cache.find(channel => channel.name == `guilds-log`).send(`Left guild [${guild.id}] [${guild.name}] \n guildCount: ${discordClient.guilds.cache.array().length}`);
        logger.log(`info`, `[${chalk.magentaBright(guild.name)}] left guild `);
        deleteConfig(guild)
            .then(() => logger.log(`info`, `[${chalk.magentaBright(guild.name)}] deleted config`),
                error => logger.log(`info`, `[${chalk.magentaBright(guild.name)}] failed deleting config \n${error}`))
        deleteState(guild)
            .then(() => logger.log(`info`, `[${chalk.magentaBright(guild.name)}] deleted state`),
                error => logger.log(`info`, `[${chalk.magentaBright(guild.name)}] failed deleting state \n${error}`))

    })
}

function deleteConfig(guild) {
    return new Promise((resolve, reject) => {
        DB.removeDoc(`guilds`, { guildId: guild.id })
            .then(() => resolve(),
                err => reject(err))

    });
}
function deleteState(guild) {
    return new Promise((resolve, reject) => {
        DB.removeDoc(`states`, { guildId: guild.id })
            .then(() => resolve(),
                err => reject(err))

    });
}


function getConfig(guild) {
    return new Promise((resolve, reject) => {
        DB.getCollection(`guilds`).then(coll => {
            coll.findOne({ guildId: guild.id }, function (err, config) {
                if (err)
                    return reject(err);
                resolve(config);
            })

        })
    });
}
function setConfig(guild, newConfig) {
    return new Promise((resolve, reject) => {
        DB.getCollection(`guilds`).then(coll => {
            coll.findOne({ guildId: guild.id }, function (err, oldConfig) {
                if (err)
                    return reject(err);

                resolve();
                for (const key in newConfig) {
                    if (newConfig.hasOwnProperty(key)) {
                        if (newConfig[key] === oldConfig[key])
                            delete newConfig[key];
                    }
                }
                if (newConfig != {})
                    coll.updateOne({ guildId: guild.id }, { $set: newConfig }, function (err, res) {
                        if (err)
                            return reject(err);
                        logger.log(`db`, `set config`);
                    })
            })

        })
    });
}
function getGameState(guild) {
    return new Promise((resolve, reject) => {
        DB.getCollection(`states`).then(coll => {
            coll.findOne({ guildId: `${guild.id}` }, function (err, state) {
                if (err)
                    return reject(err);
                resolve(state);
            })

        })
    });


}
function setGameState(guild, newState) {
    return new Promise((resolve, reject) => {
        DB.getCollection(`states`).then(coll => {
            coll.findOne({ guildId: `${guild.id}` }, function (err, oldState) {
                if (err)
                    return reject(err);

                resolve();
                for (const key in newState) {
                    if (newState.hasOwnProperty(key)) {
                        if (newState[key] === oldState[key])
                            delete newState[key];
                    }
                }
                if (newState != {})
                    coll.updateOne({ guildId: guild.id }, { $set: newState }, function (err, res) {
                        if (err)
                            return reject(err);
                        logger.log(`db`, `set game state`);
                    })
            })

        })
    });
}
function resetGameState(guild, game) {
    return new Promise((resolve, reject) => {
        DB.getCollection(`states`).then(coll => {
            coll.findOne({ guildId: `${guild.id}` }, function (err, oldState) {
                if (err)
                    return reject(err);
                let newState = getBaseState(game)
                newState.guildId = guild.id;
                resolve(newState);
                // for (const key in newState) {
                //     if (newState.hasOwnProperty(key)) {
                //         if (newState[key] === oldState[key])
                //             delete newState[key];
                //     }
                // }
                if (newState != {})
                    coll.updateOne({ guildId: guild.id }, { $set: newState }, function (err, res) {
                        if (err)
                            return reject(err);
                        logger.log(`db`, `reset game state`);
                    })
            })

        })
    });

}
function getPickMsgs(guild) {
    return new Promise((resolve, reject) => {
        DB.getCollection(`states`).then(coll => {
            coll.findOne({ guildId: `${guild.id}` }, function (err, state) {
                if (err)
                    return reject(err)
                resolve(state.pickMsgs)
            })

        })
    });
}
function setPickMsgs(guild, msgs) {
    return new Promise((resolve, reject) => {
        DB.getCollection(`states`).then(coll => {
            coll.findOne({ guildId: `${guild.id}` }, function (err, state) {
                if (err)
                    return reject(err)
                resolve()
                coll.updateOne({ guildId: guild.id }, { $set: { pickMsgs: msgs } }, function (err, res) {
                    if (err)
                        return reject(err);
                    resolve()
                    logger.log(`db`, `set pcik msgs`);
                })
            })

        })
    });
}
module.exports = {
    getConfig,
    setConfig,

    getGameState,
    setGameState,
    resetGameState,

    getPickMsgs,
    setPickMsgs,
    initGuildEvents,
}