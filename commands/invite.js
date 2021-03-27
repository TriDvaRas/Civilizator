
module.exports = {
	name: 'invite',
	description: 'Get bot invite link',
	usage: '`invite`',
	execute: async function (message, args, guildConfig) {
		const { invite } = require('../config.json');
		message.channel.send(invite)
			.catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
	},
};