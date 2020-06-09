const IO = require('./IO.js');
function createConfig(guild) {
    let config = {
        deleteCommands: false,
        roleName: "Civilized",
        channelName: "civ",
        whiteChannel: true
    }
    IO.createDir(`guilds/${guild.id}`);
    IO.Write(`guilds/${guild.id}/config.json`, config);
    IO.Write(`guilds/${guild.id}/gameState.json`, IO.Read("../BaseState.json"));
}

function initGuildEvents(client) {
    client.on('guildCreate', guild => {
        createConfig(guild);
        console.log("cr");

    })
    client.on('guildDelete', guild => {
        deleteConfig(guild);
        console.log("del");
    })
}

function deleteConfig(guild) {
    IO.removeDir(`guilds/${guild.id}`);

}





module.exports = {
    initGuildEvents
}