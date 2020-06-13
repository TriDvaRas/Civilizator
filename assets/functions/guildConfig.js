const IO = require('./IO.js');
const {createBase} = require('./Setup.js');
const logger=require(`../../logger`);
function createConfig(guild) {
    let config = {
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
        createConfig(guild);
        createBase(guild, client);
        logger.log(`info`, `Joined guild ${guild.name} -- ${guild.id}`);

    })
    client.on('guildDelete', guild => {
        deleteConfig(guild);
        logger.log(`info`, `Left guild ${guild.name} -- ${guild.id}`);
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