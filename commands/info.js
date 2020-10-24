

const info = require('../assets/info');
const Discord = require('discord.js');
module.exports = {
	name: 'info',
	description: 'Info about Civilizator',
	usage: '`info`',
	execute: async function (message, args) {
		let emb = new Discord.MessageEmbed()
			.setColor('#46a832')
			.setTitle("**Civilizator Info**")
			.setDescription("**[Invite Link](https://discord.com/oauth2/authorize?client_id=719933714423087135&scope=bot&permissions=268495952)**")
			.setThumbnail(`https://tdr.s-ul.eu/FYpCCEZi`)
			.setTimestamp()
			.setFooter('Created by TriDvaRas', 'https://tdr.s-ul.eu/hP8HuUCR')
		info.forEach(a => {
			emb.addField(a.head, a.text, false)
		});
		message.channel.send(emb).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
	},
};