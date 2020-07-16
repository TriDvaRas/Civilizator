const IO = require('./IO.js');
const { createBase } = require('./Setup.js');
const logger = require(`../../logger`);
const chalk = require('chalk');
const DB = require(`./db`);


function createConfig(guild) {
    let config = {
        prefix: "!",
        roleId: "",
        channelId: "",
        allowGetRole: true
    }
    IO.createDir(`guilds/${guild.id}`);
    IO.Write(`guilds/${guild.id}/config.json`, config);
    IO.Write(`guilds/${guild.id}/gameState.json`, IO.Read(`assets/BaseState.json`));
    IO.Write(`guilds/${guild.id}/pickMsgs.json`, []);

}

function initGuildEvents() {
    globalThis.discordClient.on('guildCreate', guild => {
        try {
            let logguild = discordClient.guilds.cache.array().find(g => g.id == `727081958823165963`);
            if (logguild)
                logguild.channels.cache.find(channel => channel.name == `guilds-log`).send(`Joined guild [${guild.id}] [${guild.name}]`);
            logger.log(`info`, `[${chalk.magentaBright(guild.name)}] joined guild `);
            createConfig(guild);
            createBase(guild);
            logger.log(`info`, `[${chalk.magentaBright(guild.name)}] created config `);
        } catch (error) {
            logger.log(`info`, `[${chalk.magentaBright(guild.name)}] failed creating config \n${error}`);
        }


    })
    globalThis.discordClient.on('guildDelete', guild => {
        try {
            let logguild = discordClient.guilds.cache.array().find(g => g.id == `727081958823165963`);
            if (logguild)
                logguild.channels.cache.find(channel => channel.name == `guilds-log`).send(`Left guild [${guild.id}] [${guild.name}] \n guildCount: ${discordClient.guilds.cache.array().length}`);
            logger.log(`info`, `[${chalk.magentaBright(guild.name)}] left guild `);
            deleteConfig(guild);
            logger.log(`info`, `[${chalk.magentaBright(guild.name)}] deleted config`);
        } catch (error) {
            logger.log(`info`, `[${chalk.magentaBright(guild.name)}] failed deleting config \n${error}`);
        }
    })
}

function deleteConfig(guild) {
    IO.removeDir(`guilds/${guild.id}`);

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
                coll.updateOne({ guildId: guild.id }, { $set: newConfig })
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
                coll.updateOne({ guildId: guild.id }, { $set: newState })
            })

        })
    });
}
function resetGameState(guild) {
    return new Promise((resolve, reject) => {
        DB.getCollection(`states`).then(coll => {
            coll.findOne({ guildId: `${guild.id}` }, function (err, oldState) {
                if (err)
                    return reject(err);
                let newState = IO.Read(`./assets/BaseState.json`);
                newState.guildId = guild.id;
                resolve(newState);
                for (const key in newState) {
                    if (newState.hasOwnProperty(key)) {
                        if (newState[key] === oldState[key])
                            delete newState[key];
                    }
                }
                coll.updateOne({ guildId: guild.id }, { $set: newState })
            })

        })
    });

}
function getPickMsgs(guild) {
    return IO.Read(`guilds/${guild.id}/pickMsgs.json`);
}
function setPickMsgs(guild, state) {
    IO.Write(`guilds/${guild.id}/pickMsgs.json`, state);
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