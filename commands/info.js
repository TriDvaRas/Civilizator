

const info = require('../assets/info');
const Discord = require('discord.js');
module.exports = {
	name: 'info',
	description: 'Info about Civilizator',
	usage: '`info`',
	execute: async function (message, args, guildConfig) {
		let emb = new Discord.MessageEmbed()
			.setColor('#46a832')
			.setTitle("**Civilizator Info**")
			.setDescription("**[Invite Link](https://discord.com/oauth2/authorize?client_id=719933714423087135&scope=bot&permissions=268495952)**")
			.setThumbnail(`https://tdr.s-ul.eu/FYpCCEZi`)
			.setTimestamp()
			.setFooter('Created by TriDvaRas#4805', 'https://tdr.s-ul.eu/hP8HuUCR')
		info.forEach(a => {
			emb.addField(a.head, a.text, false)
		});
		message.channel.send(emb)
			.catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
	},
};