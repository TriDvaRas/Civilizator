//Setup
const fs = require('fs');
const winston = require('winston');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const GC = require("./assets/functions/guildConfig.js");
const client = new Discord.Client();

//Set logger
const logger = require("./logger")

client.on('ready', () => logger.log('info', 'Logged in'))
	.on('debug', m => logger.log('debug', m))
	.on('warn', m => logger.log('warn', m))
	.on('error', m => logger.log('error', m));

process
	.on('uncaughtException', error => {
		logger.log('error', error);
	})
	.on('unhandledRejection', error => {
		logger.log('error', error);
	})
	.on('SIGHUP', () => {
		logger.log('info', 'Shutting down...')
		process.kill(process.ppid);
	})

logger.log('rat', "RAt")
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
client.login(token);

//guild join/leave event
GC.initGuildEvents(client);

client.on('message', message => {
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
			//send usage
			if (args[0] == "help") {
				message.channel.send(`${client.commands.get(command).description}\nUsage:\n${client.commands.get(command).usage}`)
			} else
				client.commands.get(command).execute(message, args);
		} catch (error) {
			logger.log('error', error)
		}
	else if (client.civcommands.has(command) && GC.getConfig(message.guild).channelId == message.channel.id)
		try {
			//send usage
			if (args[0] == "help") {
				message.channel.send(`${client.civcommands.get(command).description}\nUsage:\n${client.civcommands.get(command).usage}`)
			} else
				client.civcommands.get(command).execute(message, args);
		} catch (error) {
			logger.log('error', error)
		}

});


