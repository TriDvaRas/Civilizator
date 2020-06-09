//Setup
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

//read CommandList
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


client.once('ready', () => {
	console.log('Started!');
});

client.login(token);

client.on('message', message => {
	//check if message is a command and author is not a bot
	if (!message.content.startsWith(prefix) || message.author.bot) 
		return;
	//split message into command and arguments
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	//exit if command doesn't exist
	if (!client.commands.has(command)) return;
	//execute command		
	try {
		//send usage
		if (args[0] == "help") {
			message.channel.send(`${client.commands.get(command).description}\nUsage:\n${client.commands.get(command).usage}`)
		} else
			client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('Ты еблан?');
	}
});