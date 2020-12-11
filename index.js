//imports
const fs = require('fs');
const Discord = require('discord.js');
const { token } = require('./config.json');
const GC = require("./functions/guildConfig.js");
const cron = require('node-cron');
const handleMessage = require(`./functions/messageHandler`)
const RT = require('./functions/regularTasks');

//Set logger
const logger = require("./logger");

//global settings 
globalThis.gameMaxTime = 3*3600000;
globalThis.gameMaxIdle = 3600000;
globalThis.finalDelay = 1000;
globalThis.fastCD = 30000;
globalThis.gameNames = [`civ5`, `lek`, `civ6`]

//setup Client
globalThis.discordClient = new Discord.Client({
	presence: {
		activity: {
			name: "Bad Apple!!",
			type: "PLAYING"
		}
	}
});

//active games list
globalThis.activeGames = new Discord.Collection();

//setup client events
discordClient
	.on('ready', () => {
		logger.log('dapi', 'Bot logged in');
		globalThis.logGuild = globalThis.discordClient.guilds.cache.get(`727081958823165963`);
		RT.updateLocalStats();

		// save daily server stats 
		cron.schedule('59 23 * * *', () => {
			RT.updateSheetStats()
		})
		// sync local stats with db
		cron.schedule('* * * * *', () => {
			RT.updateLocalStats()
		})
		// update pressence 
		cron.schedule('*/10 * * * * *', () => {
			RT.updatePressence()
		})
		// flush ended games 
		cron.schedule('*/30 * * * *', () => {
			RT.flushGames()
		})
		// save new games
		cron.schedule('0 */2 * * *', () => {
			logger.log(`info`,	`Syncing new games...`)
			RT.updateSheetGames()
		})
	})
	.on('message', handleMessage)
	.on('warn', error => logger.log('warn', `[*]\n${error.stack}`))
	.on('debug', error => { if (error.includes(`Session Limit Information`)) logger.log('dapi', `Logins remaining ${error.slice(-3)}`) })
	.on('error', error => {
		if (`${error.stack}`.includes(`DiscordAPIError`))
			logger.log('dapi', `[*]\n${error.stack}`)
		else
			logger.log('error', `[*]\n${error.stack}`)
	})
// setup process events
process
	.on('uncaughtException', error => {
		if (`${error.stack}`.includes(`DiscordAPIError`))
			logger.log('dapi', `[*]\n${error.stack}`)
		else
			logger.log('error', `[*]\n${error.stack}`)
	})
	.on('unhandledRejection', error => {
		if (`${error.stack}`.includes(`DiscordAPIError`))
			logger.log('dapi', `[*]\n${error.stack}`)
		else
			logger.log('error', `[*]\n${error.stack}`)
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

//login
logger.log(`info`, `Logging in...`)
discordClient.login(token);///////////////////////////////////////

//guild join/leave event
GC.initGuildEvents();
