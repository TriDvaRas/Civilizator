const { createBase } = require('./Setup.js');
const db = require(`./db`);
const getBaseState = require(`../functions/baseState`)


function initGuildEvents() {
    globalThis.discordClient.on('guildCreate', guild => {
        if (global.logGuild)
            global.logGuild.channels.cache.find(channel => channel.name == `guilds-log`).send(`Joined guild [${guild.id}] [${guild.name}]\n guildCount: ${discordClient.guilds.cache.size}`)
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

        if (global.logGuild)
            global.logGuild.channels.cache.find(channel => channel.name == `guilds-log`).send(`Left guild [${guild.id}] [${guild.name}] \n guildCount: ${discordClient.guilds.cache.size}`)
        logger.log(`info`, `[${chalk.magentaBright(guild.name)}] left guild `);
        deleteConfig(guild)
            .then(() => logger.log(`info`, `[${chalk.magentaBright(guild.name)}] deleted config`),
                error => logger.log(`info`, `[${chalk.magentaBright(guild.name)}] failed deleting config \n${error}`))
        deleteState(guild)
            .then(() => logger.log(`info`, `[${chalk.magentaBright(guild.name)}] deleted state`),
                error => logger.log(`info`, `[${chalk.magentaBright(guild.name)}] failed deleting state \n${error}`))

    })
}



//     //TODO remove this shit
// function getConfig(guild) {
//     //TODO
// }
// function setConfig(guild, newConfig) {
//     //TODO
// }
// function getGameState(guild) {
//     //TODO
// }
// function setGameState(guild, newState) {
//     //TODO
// }
// function resetGameState(guild, game) {
//     //TODO
// }
// function getPickMsgs(guild) {
//     //TODO
// }
// function setPickMsgs(guild, msgs) {
//     //TODO
// }
module.exports = {
    initGuildEvents,
}