

//Setup
const fs = require('fs');
const IO = require('./functions/IO');
const DB = require('./functions/db');
const Discord = require('discord.js');
const { token } = require('./config.json');
const GC = require("./functions/guildConfig.js");
let pressences = IO.Read(`./pressence.json`);
let pressI = 1;

globalThis.reactionsMaxTime = 900000;
globalThis.finalDelay = 1000;
globalThis.fastCD = 60000;

globalThis.discordClient = new Discord.Client({
	presence: {
		activity: {
			name: "Star Beat!",
			type: "LISTENING"
		}
	}
});
globalThis.gameNames=[`civ5`,`lek`,`civ6`]



//Set logger
const logger = require("./logger");
const chalk = require('chalk');
const db = require('./functions/db');

discordClient.on('ready', () => {
	logger.log('warn', 'Bot logged in');
	updateStats();
	discordClient.setInterval(setPressence, 15532 * 1.68);
	discordClient.setInterval(updateStats, 98 * 1008);
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
discordClient.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	discordClient.commands.set(command.name, command);
}
//read civCommands
discordClient.civcommands = new Discord.Collection();
const civCommandFiles = fs.readdirSync('./civcommands').filter(file => file.endsWith('.js'));
for (const file of civCommandFiles) {
	const command = require(`./civcommands/${file}`);
	discordClient.civcommands.set(command.name, command);
}


logger.log(`info`, `Logging in...`)
discordClient.login(token);///////////////////////////////////////

//guild join/leave event
GC.initGuildEvents(discordClient);

discordClient.on('message', message => {
	if (message.author.bot)
		return;
	if (message.guild == null) {
		discordClient.users.cache.array().find(user => user.id == 272084627794034688).createDM().then(DM => DM.send(`**FEED**
From: ${message.author}
Text: ${message.toString()}
Attachments: ${message.attachments.array().map(x => `${x.name}\n${x.url}`).join(`,\n`)}`))
		message.channel.send(`Your message was successfully submited 👍`)
		return;
	}



	GC.getConfig(message.guild)
		.then(cfg => {
			let args, command;
			const prefix = cfg.prefix;
			if (message.content.startsWith(prefix)) {
				args = message.content.slice(prefix.length).split(/ +/);
				command = args.shift().toLowerCase();
			}
			else if (message.content == `<@!${discordClient.user.id}>` || message.content == `<@${discordClient.user.id}>`) {
				message.channel.send(new Discord.MessageEmbed()
					.setTitle(`Bot Settings`)
					.setColor('#46a832')
					.addField(`Server`, message.guild.name, false)
					.addField(`Prefix`, prefix, true)
					.addField(`Role`, `<@&${cfg.roleId}>`, true)
					.addField(`Channel`, `<#${cfg.channelId}>`, true)
					.addField(`Normal Games Count`, cfg.gameCount, false)
					.addField(`Fast Games Count`, cfg.fastCount, true)
					.setTimestamp()
					.setFooter('Created by TriDvaRas', 'https://tdr.s-ul.eu/hP8HuUCR')
				)
			}
			else if (message.content.startsWith(`<@!${discordClient.user.id}>`) || message.content.startsWith(`<@${discordClient.user.id}>`)) {
				args = message.content.split(/ +/);
				args.shift();
				command = args.shift().toLowerCase();
			}
			else
				return;
			//exit if command doesn't exist
			if (discordClient.commands.has(command))
				//execute command		
				try {
					logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${chalk.bold.rgb(255, 87, 20)(command)} ${chalk.bold.yellowBright(args.join(` `))}`);
					if (args[0] == "help") {
						message.channel.send(`${discordClient.commands.get(command).description}\nUsage:\n${discordClient.commands.get(command).usage}\n${discordClient.commands.get(command).example ? 'Example:\n' + discordClient.commands.get(command).example : ""}`).then(msg => { message.delete({ timeout: 30000 }); msg.delete({ timeout: 30000 }) });
					} else
						discordClient.commands.get(command).execute(message, args);
				} catch (error) {
					logger.log('error', `[${chalk.magentaBright(message.guild.name)}] ${error}`)
				}
			else if (discordClient.civcommands.has(command))
				try {
					logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${chalk.bold.rgb(255, 87, 20)(command)} ${chalk.bold.yellowBright(args.join(` `))}`);
					if (args[0] == "help") {
						message.channel.send(`${discordClient.civcommands.get(command).description}\nUsage:\n${discordClient.civcommands.get(command).usage}\n${discordClient.civcommands.get(command).example ? 'Example:\n' + discordClient.civcommands.get(command).example : ""}`).then(msg => { message.delete({ timeout: 30000 }); msg.delete({ timeout: 30000 }) });
					} else if (cfg.channelId == message.channel.id || process.argv.includes(`test`))
						discordClient.civcommands.get(command).execute(message, args);
					else {
						logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] bad channel`);
						message.reply(`Randomizer-related commands only work in set channel. You can check current channel and role settings by mentioning bot.`);
					}
				} catch (error) {
					logger.log('error', `[${chalk.magentaBright(message.guild.name)}] ${error}`)
				}
		},
			err =>
				logger.log(`error`, `${err}`)
		);
});


function setPressence() {

	let act = pressences.shift();
	pressences.push(act);

	let stats = IO.Read(`./stats.json`);

	let name = act.name;
	if (name.includes(`{guildCount}`))
		name = name.replace(`{guildCount}`, `${discordClient.guilds.cache.array().length}`);
	else if (name.includes(`{gamesCount}`))
		name = name.replace(`{gamesCount}`, `${stats.gameCount}`)
	else if (name.includes(`{fastCount}`))
		name = name.replace(`{fastCount}`, `${stats.fastCount}`)
	else if (name.includes(`{uptime}`))
		name = name.replace(`{uptime}`, `${getUptime()}`)
	else if (name.includes(`{civilizedCount}`))
		name = name.replace(`{civilizedCount}`, `${stats.userCount}`);

	if (pressences.length == 0 || pressences.length == pressI) {
		pressences = IO.Read(`./pressence.json`);
		pressI = 0;
	}
	pressI++;
	discordClient.user.setPresence({
		activity: {
			name: name,
			type: act.type
		}
	})
}

function getUptime() {
	let ms = discordClient.uptime;
	let s = Math.floor(ms / 1000) % 60;
	let m = Math.floor(ms / 60000) % 60;
	let h = Math.floor(ms / 3600000);
	return `${h.toString().length == 1 ? '0' + h : h}:${m.toString().length == 1 ? '0' + m : m}:${s.toString().length == 1 ? '0' + s : s}`
}

function getCivilizedCount() {
	return new Promise((resolve, reject) => {
		let Qs = [];
		discordClient.guilds.cache.each(guild => {
			Qs.push(new Promise((resolve, reject) => {
				GC.getConfig(guild).then(cfg => {
					let roleId = cfg.roleId;
					let sum = 0;
					guild.members.cache.each(member => {
						if (member.roles.cache.has(roleId))
							sum++;
					});
					resolve(sum)
				},
					err =>
						logger.log(`error`, `${err}`)
				);
			}))



		});
		Promise.all(Qs).then(values => {
			let sum = 0;
			values.forEach(v => sum += v);
			resolve(sum);
		});
	})

}

function updateStats() {
	let stats = {}
	getCivilizedCount().then(count => {
		stats[`userCount`] = count;
		db.getStats().then(doc => {
			stats[`gameCount`] = doc.lastGameId;
			stats[`fastCount`] = doc.globalFastCount;
			IO.Write(`./stats.json`, stats);
		})

	})
}