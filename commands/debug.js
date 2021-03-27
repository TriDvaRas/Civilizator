

const Discord = require('discord.js');

module.exports = {
    name: 'debug',
    description: `debug(bot owner only) (you shouldn't see this btw, pls send smth like \`i can see debug\` here)`,
    ignore: true,
    usage: '`debug`',
    execute: async function (message, args, guildConfig) {
        if (message.author.id == 272084627794034688)
            message.channel.send(new Discord.MessageEmbed()
                .addField(`author`, `${message.author.tag}/${message.author.id}`)
                .addField(`guild`, `${message.guild.name}/${message.guild.id}`)
                .addField(`channel`, `${message.channel.name}/${message.channel.id}`)
                .addField(`Active games`, `${globalThis.activeGames.map(game => `${game.guild} ${game.phase} ${time(Math.floor((Date.now() - game.startedAt)))}`).join(`\n`)}\u200B`)
                .addField(`Memory Usage`, mem())
                .addField(`UpTime`, time(global.discordClient.uptime))
                .addField(`LocalTime`, now())
                .setColor(`RANDOM`)
            )
                .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
    },
};

function time(t) {
    t = Math.floor(t / 1000);
    let s = t % 60
    let m = ((t - s) / 60) % 60
    let h = ((t - 60 * m - s) / 3600) % 12
    return `${`${h}`.length < 2 ? `0${h}` : h}:${`${m}`.length < 2 ? `0${m}` : m}:${`${s}`.length < 2 ? `0${s}` : s}`
}
function mem() {
    let str = `\u200B`
    const used = process.memoryUsage();
    for (let key in used) {
        str += `${Math.round(used[key] / 1024 / 1024 * 100) / 100}MB ${key} \t\n`
    }
    return str
}
function now() {
    return new Date().toTimeString()
}