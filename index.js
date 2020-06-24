

//Setup
const fs = require('fs');
const IO = require('./assets/functions/IO');
const sheet = require('./assets/functions/sheet');
const Discord = require('discord.js');
const { token } = require('./config.json');
const GC = require("./assets/functions/guildConfig.js");
let pressences = JSON.parse(fs.readFileSync("pressence.json", "utf8"))
const client = new Discord.Client({
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

client.on('ready', () => {
	logger.log('info', 'Logged in');
	updateGameCount();
	client.setInterval(setPressence, 25000);
	client.setInterval(updateGameCount, 300000);
})
	.on('debug', m => logger.log('debug', `[*] ${m}`))
	.on('warn', m => logger.log('warn', `[*] ${m}`))
	.on('error', m => {
		logger.log('error', `[*] ${m}`)
		console.log(m)
	});

process
	.on('uncaughtException', error => {
		logger.log('error', `[*] ${error}`);
		console.log(error)
	})
	.on('unhandledRejection', error => {
		logger.log('error', `[*] ${error}`);
		console.log(error)
	})
	.on('SIGHUP', () => {
		logger.log('info', 'Shutting down...')
	})

//read CommandList
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
//read civCommands
client.civcommands = new Discord.Collection();
const civCommandFiles = fs.readdirSync('./civcommands').filter(file => file.endsWith('.js'));
for (const file of civCommandFiles) {
	const command = require(`./civcommands/${file}`);
	client.civcommands.set(command.name, command);
}


logger.log(`info`, `Logging in...`)
client.login(token);///////////////////////////////////////

//guild join/leave event
GC.initGuildEvents(client);

client.on('message', message => {
	if (message.guild == null || message.author.bot) {
		//sheet.submitReport();
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
	if (client.commands.has(command))
		//execute command		
		try {
			logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${chalk.bold.rgb(255, 87, 20)(command)} ${chalk.bold.yellowBright(args.join(` `))}`);
			if (args[0] == "help") {
				message.channel.send(`${client.commands.get(command).description}\nUsage:\n${client.commands.get(command).usage}`).then(msg => { message.delete({ timeout: 30000 }); msg.delete({ timeout: 30000 }) });
			} else
				client.commands.get(command).execute(message, args);
		} catch (error) {
			logger.log('error', `[${chalk.magentaBright(message.guild.name)}] ${error}`)
		}
	else if (client.civcommands.has(command) && GC.getConfig(message.guild).channelId == message.channel.id)
		try {
			logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${chalk.bold.rgb(255, 87, 20)(command)} ${chalk.bold.yellowBright(args.join(` `))}`);
			if (args[0] == "help") {
				message.channel.send(`${client.civcommands.get(command).description}\nUsage:\n${client.civcommands.get(command).usage}`).then(msg => { message.delete({ timeout: 30000 }); msg.delete({ timeout: 30000 }) });
			} else
				client.civcommands.get(command).execute(message, args);
		} catch (error) {
			logger.log('error', `[${chalk.magentaBright(message.guild.name)}] ${error}`)
		}

});


function setPressence() {
	let act = pressences.shift();
	pressences.push(act);
	client.user.setPresence({
		activity: {
			name: act.name.replace(`{guildCount}`, `${client.guilds.cache.array().length}`).replace(`{gamesCount}`, `${IO.Read(`./stats.json`).gameCount}`),
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

sheet.test();