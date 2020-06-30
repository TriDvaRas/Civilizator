

//Setup
const fs = require('fs');
const IO = require('./assets/functions/IO');
const sheet = require('./assets/functions/sheet');
const Discord = require('discord.js');
const { token } = require('./config.json');
const GC = require("./assets/functions/guildConfig.js");
let pressences = JSON.parse(fs.readFileSync("pressence.json", "utf8"))


globalThis.client = new Discord.Client({
	presence: {
		activity: {
			name: "Star Beat!",
			type: "LISTENING"
		}
	}
});
//Set logger
const logger = require("./logger");
const chalk = require('chalk');

globalThis.client.on('ready', () => {
	logger.log('info', 'Logged in');
	updateGameCount();
	globalThis.client.setInterval(setPressence, 25000);
	globalThis.client.setInterval(updateGameCount, 1825000);
})
	.on('debug', error => logger.log('debug', `[*]\n${error.stack}`))
	.on('warn', error => logger.log('warn', `[*]\n${error.stack}`))
	.on('error', error => {
		logger.log('error', `[*]\n${error.stack}`)
	});

process
	.on('uncaughtException', error => {
		logger.log('error', `[*]\n${error.stack}`);
	})
	.on('unhandledRejection', error => {
		logger.log('error', `[*]\n${error.stack}`);
	})
	.on('SIGHUP', () => {
		logger.log('info', 'Shutting down...')
	})

//read CommandList
globalThis.client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	globalThis.client.commands.set(command.name, command);
}
//read civCommands
globalThis.client.civcommands = new Discord.Collection();
const civCommandFiles = fs.readdirSync('./civcommands').filter(file => file.endsWith('.js'));
for (const file of civCommandFiles) {
	const command = require(`./civcommands/${file}`);
	globalThis.client.civcommands.set(command.name, command);
}


logger.log(`info`, `Logging in...`)
globalThis.client.login(token);///////////////////////////////////////

//guild join/leave event
GC.initGuildEvents(globalThis.client);

globalThis.client.on('message', message => {
	if (message.author.bot)
		return;
	if (message.guild == null) {
		globalThis.client.users.cache.array().find(user => user.id == 272084627794034688).createDM().then(DM => DM.send(`**FEED**
From: ${message.author}
Text: ${message.toString()}
Attachments: ${message.attachments.array().map(x => `${x.name}\n${x.url}`).join(`,\n`)}`))
		message.channel.send(`Your message was successfully submited 👍`)
		return;
	}
	let prefix = GC.getConfig(message.guild).prefix;
	//check if message is a command and author is not a bot
	if (!message.content.startsWith(prefix) || message.author.bot)
		return;
	//split message into command and arguments
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	//exit if command doesn't exist
	if (globalThis.client.commands.has(command))
		//execute command		
		try {
			logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${chalk.bold.rgb(255, 87, 20)(command)} ${chalk.bold.yellowBright(args.join(` `))}`);
			if (args[0] == "help") {
				message.channel.send(`${globalThis.client.commands.get(command).description}\nUsage:\n${globalThis.client.commands.get(command).usage}`).then(msg => { message.delete({ timeout: 30000 }); msg.delete({ timeout: 30000 }) });
			} else
				globalThis.client.commands.get(command).execute(message, args);
		} catch (error) {
			logger.log('error', `[${chalk.magentaBright(message.guild.name)}] ${error}`)
		}
	else if (globalThis.client.civcommands.has(command) && GC.getConfig(message.guild).channelId == message.channel.id)
		try {
			logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${chalk.bold.rgb(255, 87, 20)(command)} ${chalk.bold.yellowBright(args.join(` `))}`);
			if (args[0] == "help") {
				message.channel.send(`${globalThis.client.civcommands.get(command).description}\nUsage:\n${globalThis.client.civcommands.get(command).usage}`).then(msg => { message.delete({ timeout: 30000 }); msg.delete({ timeout: 30000 }) });
			} else
				globalThis.client.civcommands.get(command).execute(message, args);
		} catch (error) {
			logger.log('error', `[${chalk.magentaBright(message.guild.name)}] ${error}`)
		}

});


function setPressence() {
	let act = pressences.shift();
	pressences.push(act);
	globalThis.client.user.setPresence({
		activity: {
			name: act.name.replace(`{guildCount}`, `${globalThis.client.guilds.cache.array().length}`).replace(`{gamesCount}`, `${IO.Read(`./stats.json`).gameCount}`),
			type: act.type
		}
	})
}
function updateGameCount() {

	sheet.getGameCount().then(count => {
		let stats = IO.Read(`./stats.json`);
		stats.gameCount = +count;
		IO.Write(`./stats.json`, stats);
	})
}


