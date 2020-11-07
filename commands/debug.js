

const Discord = require('discord.js');

module.exports = {
    name: 'debug',
    description: `debug(bot owner only) (you shouldn't see this btw, pls send smth like \`i can see debug\` here)`,
    ignore: true,
    usage: '`debug`',
    execute: async function (message, args) {
        if (message.author.id == 272084627794034688)
            message.channel.send(new Discord.MessageEmbed()
                .addField(`author`, `${message.author.tag}/${message.author.id}`)
                .addField(`guild`, `${message.guild.name}/${message.guild.id}`)
                .addField(`channel`, `${message.channel.name}/${message.channel.id}`)
                .addField(`Active games`, `${globalThis.activeGames.map(game => `${game.guild} ${game.phase} ${time(game.startedAt)}`).join(`\n`)}\u200B`)
                .addField(`Memory Usage`, mem())
                .setColor(`RANDOM`)
            )
                .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
    },
};

function time(t) {
    let dif = Math.floor((Date.now() - t) / 1000)
    let s = dif % 60
    let m = ((dif - s) / 60) % 60
    let h = ((dif - 60 * m - s) / 3600) % 12
    return `${h}:${m}:${s}`
}
function mem() {
    let str=`\u200B`
    const used = process.memoryUsage();
    for (let key in used) {
        str+=`${Math.round(used[key] / 1024 / 1024 * 100) / 100}MB ${key} \t\n`
    }
    return str
}