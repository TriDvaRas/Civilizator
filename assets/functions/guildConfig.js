const IO = require('./IO.js');
const { createBase } = require('./Setup.js');
const logger = require(`../../logger`);
const chalk = require('chalk');

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
    globalThis.client.on('guildCreate', guild => {
        try {
            logger.log(`info`, `[${chalk.magentaBright(guild.name)}] joined guild `);
            createConfig(guild);
            createBase(guild);
            logger.log(`info`, `[${chalk.magentaBright(guild.name)}] created config `);
        } catch (error) {
            logger.log(`info`, `[${chalk.magentaBright(guild.name)}] failed creating config \n${error}`);
        }


    })
    globalThis.client.on('guildDelete', guild => {
        try {
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
    return IO.Read(`guilds/${guild.id}/config.json`);
}
function setConfig(guild, config) {
    IO.Write(`guilds/${guild.id}/config.json`, config);
}
function getGameState(guild) {
    return IO.Read(`guilds/${guild.id}/gameState.json`);
}
function setGameState(guild, state) {
    IO.Write(`guilds/${guild.id}/gameState.json`, state);
}
function resetGameState(guild) {
    IO.Write(`guilds/${guild.id}/gameState.json`, IO.Read(`assets/BaseState.json`));
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