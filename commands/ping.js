let Embeder = require("../assets/functions/embeder.js")
module.exports = {
	name: 'ping',
	description: 'ping!',
	usage: '`ping`',
	execute: async function (message, args) {
		message.channel.send('Pong!');
	},
};