
module.exports = {
	name: 'invite',
	description: 'Get bot invite link',
	usage: '`invite`',
	execute:async function(message, args) {
        const { invite } = require('../config.json');
		message.channel.send(invite).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
	},
};