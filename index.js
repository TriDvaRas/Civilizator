/*global  gameNames, logger, discordClient,process gameMaxTime*/
//global settings 
globalThis.gameMaxTime = 2 * 3600000;
globalThis.gameMaxIdle = 3600000;
globalThis.fastCD = 30000;
globalThis.localeCodes = [`en`, `it`]
globalThis.gameNames = [`Civ5`, `LEK`, `Civ6`]
globalThis.gameLogos = {
    "Civ5": 'https://tdr.s-ul.eu/HFuCvc8b',
    "LEK": 'https://tdr.s-ul.eu/HFuCvc8b',
    "Civ6": 'https://tdr.s-ul.eu/yNXGRctD'
}
globalThis.gameNamesLower = gameNames.map(x => x.toLowerCase())

//imports
const fs = require('fs');
const Discord = require('discord.js');
const { token, botOwnerId } = require('./config.json');
const GC = require("./functions/guildConfig.js");
const cron = require('node-cron');
const handleMessage = require(`./functions/messageHandler`)
const RT = require('./functions/regularTasks');

global.botOwnerId = botOwnerId
global.Collection = Discord.Collection
//Set logger
global.logger = require("./logger");
global.chalk = require(`chalk`);


//setup Client
globalThis.discordClient = new Discord.Client({
    presence: {
        activity: {
            name: "Rondo³⭕⭕⭕",
            type: "WATCHING"
        }
    },
    messageCacheLifetime: gameMaxTime / 1000,
    messageSweepInterval: 30,
    messageEditHistoryMaxSize: 1,
});

//active games list
globalThis.activeGames = new Discord.Collection();

//setup client events
discordClient
    .on('ready', () => {
        logger.log('dapi', 'Bot logged in');
        globalThis.logGuild = globalThis.discordClient.guilds.cache.get(`727081958823165963`);

        // save daily server stats 
        cron.schedule('59 23 * * *', () => {
            RT.updateDaily()
        })
        // update pressence 
        cron.schedule('*/10 * * * * *', () => {
            RT.updatePressence()
        })
        // flush ended games 
        cron.schedule('*/30 * * * * *', () => {
            RT.flushGames()
        })
    })
    .on('message', handleMessage)
    .on('warn', error => logger.log('warn', `[*]\n${error.stack}`))
    .on('debug', error => { if (error.includes(`Session Limit Information`)) logger.log('dapi', `Logins remaining ${error.slice(-3)}`) })
    .on('error', error => {
        if (`${error.stack}`.includes(`DiscordAPIError`))
            logger.log('dapi', `[*]\n${error.stack ? error.stack : error}`)
        else
            logger.log('error', `[*]\n${error.stack ? error.stack : error}`)
    })
// setup process events
process
    .on('uncaughtException', error => {
        if (`${error.stack}`.includes(`DiscordAPIError`))
            logger.log('dapi', `[*]\n${error.stack ? error.stack : error}`)
        else
            logger.log('error', `[*]\n${error.stack ? error.stack : error}`)
    })
    .on('unhandledRejection', error => {
        if (`${error?.stack}`.includes(`DiscordAPIError`))
            logger.log('dapi', `[**]\n${error.stack ? error.stack : error}`)
        else
            logger.log('error', `[**]\n${error.stack ? error.stack : error}`)
    })
    .on('SIGHUP', () => {
        logger.log('info', 'Shutting down...')
    })

//init Commands
discordClient.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    discordClient.commands.set(command.name, command);
}
//init civCommands
discordClient.civcommands = new Discord.Collection();
const civCommandFiles = fs.readdirSync('./civcommands').filter(file => file.endsWith('.js'));
for (const file of civCommandFiles) {
    const command = require(`./civcommands/${file}`);
    discordClient.civcommands.set(command.name, command);
}
//init civCommands shortcuts
const shortcutsFiles = fs.readdirSync('./shortcuts').filter(file => file.endsWith('.js'));
for (const file of shortcutsFiles) {
    const command = require(`./shortcuts/${file}`);
    discordClient.civcommands.set(command.name, command);
}

//login
logger.log(`info`, `Logging in...`)
discordClient.login(token);///////////////////////////////////////

//guild join/leave event
GC.initGuildEvents();