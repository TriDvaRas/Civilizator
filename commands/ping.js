
module.exports = {
	name: 'ping',
	description: 'Ping!',
	usage: '`ping`',
	execute: async function (message, args) {
		message.channel.send('Pong!').catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
	},
};