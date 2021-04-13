const { MessageEmbed } = require("discord.js");

/*global botOwnerId */
module.exports = {
    name: 'todo',
    description: `todo(bot owner only) (you shouldn't see this btw, pls send smth like \`i can see todo\` here)`,
    ignore: true,
    usage: '`fcf`',
    execute: function execute(message, args, guildConfig) {
        if (message.author.id == botOwnerId) {
            let channel = global.logGuild.channels.cache.find(x => x.name == `todo`)
            if (!channel)
                return message.reply(`No todo channel(`)
            message.delete()
            channel.send(new MessageEmbed()
                .addField(`${args.join(` `)}\u200B`, `\u200B`)
                .setColor('RANDOM')
                .setAuthor(message.author.tag, `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png `)
            ).then(msg => {
                msg.react(`<:atashi:825376537724977192>`)
                msg.react(`✅`)
                msg.react(`<:saiseisan:825376560156246056>`)
            })
        }
    },
};