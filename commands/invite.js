
module.exports = {
	name: 'invite',
	description: 'Gives bot invite link',
	usage: '`!invite`',
	execute:async function(message, args) {
        const { invite } = require('../config.json');
		message.channel.send(invite);
	},
};