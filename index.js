

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

client.on('ready', () => {
	logger.log('info', 'Logged in');
	updateGameCount();
	client.setInterval(setPressence, 15532 * 1.68);
	client.setInterval(updateGameCount, 630250);
})
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
	if (message.author.bot)
		return;
	if (message.guild == null) {
		client.users.cache.array().find(user => user.id == 272084627794034688).createDM().then(DM => DM.send(`**FEED**
From: ${message.author}
Text: ${message.toString()}
Attachments: ${message.attachments.array().map(x => `${x.name}\n${x.url}`).join(`,\n`)}`))
		message.channel.send(`Your message was successfully submited 👍`)
		return;
	}
	let args, command;
	const prefix = GC.getConfig(message.guild).prefix;
	if (message.content.startsWith(prefix)) {
		args = message.content.slice(prefix.length).split(/ +/);
		command = args.shift().toLowerCase();
	}
	else if (message.content.startsWith(`<@!${client.user.id}>`)) {
		args = message.content.split(/ +/);
		args.shift();
		command = args.shift().toLowerCase();
	}
	else
		return;
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
	let name = act.name;
	if (name.includes(`{guildCount}`))
		name = name.replace(`{guildCount}`, `${client.guilds.cache.array().length}`);
	else if (name.includes(`{gamesCount}`))
		name = name.replace(`{gamesCount}`, `${IO.Read(`./stats.json`).gameCount}`)
	else if (name.includes(`{uptime}`))
		name = name.replace(`{uptime}`, `${getUptime()}`)
	else if (name.includes(`{civilizedCount}`))
		name = name.replace(`{civilizedCount}`, `${getCivilizedCount()}`);

	client.user.setPresence({
		activity: {
			name: name,
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

function getUptime() {
	let ms = client.uptime;
	let s = Math.floor(ms / 1000) % 60;
	let m = Math.floor(ms / 60000) % 60;
	let h = Math.floor(ms / 3600000);
	return `${h.toString().length == 1 ? '0' + h : h}:${m.toString().length == 1 ? '0' + m : m}:${s.toString().length == 1 ? '0' + s : s}`
}

function getCivilizedCount() {
	let sum = 0;
	client.guilds.cache.each(guild => {
		let roleId = GC.getConfig(guild).roleId;
		console.log(roleId);
		guild.members.cache.each(member => {
			if (member.roles.cache.has(roleId)) 
				sum++;
		});

	});
	return sum;
}