const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Ping!',
    usage: '`ping`',
    execute: function execute(message, args, guildConfig) {
        let ping = Date.now() - message.createdTimestamp
        let color = `GREEN`
        if (ping > 300) color = `RED`
        else if (ping > 250) color = `ORANGE`
        else if (ping > 200) color = `YELLOW`
        
        message.channel.send(new MessageEmbed()
            .addField(`Pong in`, `${ping}ms`)
            .setColor(color)
        )
    },
};