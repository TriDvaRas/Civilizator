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

}

function initGuildEvents(client) {
    client.on('guildCreate', guild => {
        try {
            logger.log(`info`, `[${chalk.magentaBright(message.guild.name)}] joined guild `);
            createConfig(guild);
            createBase(guild, client);
            logger.log(`info`, `[${chalk.magentaBright(message.guild.name)}] created config `);
        } catch (error) {
            logger.log(`info`, `[${chalk.magentaBright(message.guild.name)}] failed creating config \n${error}`);
        }


    })
    client.on('guildDelete', guild => {
        try {
            logger.log(`info`, `[${chalk.magentaBright(message.guild.name)}] left guild `);
            deleteConfig(guild);
            logger.log(`info`, `[${chalk.magentaBright(message.guild.name)}] deleted config`);
        } catch (error) {
            logger.log(`info`, `[${chalk.magentaBright(message.guild.name)}] failed deleting config \n${error}`);
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

module.exports = {
    getConfig,
    setConfig,

    getGameState,
    setGameState,
    resetGameState,

    initGuildEvents,
}