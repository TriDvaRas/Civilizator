
module.exports = {
	name: 'ping',
	description: 'Ping!',
	usage: '`ping`',
	execute: async function (message, args) {
		message.channel.send('Pong!')
			.catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
	},
};