
/* global process activeGames discordClient botOwnerId*/
const Discord = require('discord.js');

module.exports = {
    name: 'debug',
    description: `debug(bot owner only) (you shouldn't see this btw, pls send smth like \`i can see debug\` here)`,
    ignore: true,
    usage: '`debug`',
    execute: function execute(message, args, guildConfig) {
        if (message.author.id == botOwnerId)
            message.channel.send(new Discord.MessageEmbed()
                .addField(`author`, `${message.author}/${message.author.id}`)
                .addField(`guild`, `${message.guild}/${message.guild.id}`)
                .addField(`channel`, `${message.channel}/${message.channel.id}`)
                .addField(`roles`, `${message.member.roles.cache.map(x => `${x}/${x.id}`).join(`\n`)}`)
                .addField(`Active games`, `${activeGames.map(game => `${game.guild} ${game.phase} ${time(Math.floor((Date.now() - game.startedAt)))}`).join(`\n`)}\u200B`)
                .addField(`Memory Usage`, mem())
                .addField(`UpTime`, time(discordClient.uptime))
                .addField(`LocalTime`, now())
                .setColor(`RANDOM`)
            )
    },
};

function time(t) {
    t = Math.floor(t / 1000);
    let s = t % 60
    let m = ((t - s) / 60) % 60
    let h = ((t - (60 * m) - s) / 3600) % 12
    return `${`${h}`.length < 2 ? `0${h}` : h}:${`${m}`.length < 2 ? `0${m}` : m}:${`${s}`.length < 2 ? `0${s}` : s}`
}
function mem() {
    let str = `\u200B`
    const used = process.memoryUsage();
    for (let key in used) {
        if (Object.prototype.hasOwnProperty.call(used, key)) {
            str += `${Math.round(used[key] / 1024 / 1024 * 100) / 100}MB ${key} \t\n`
        }
    }
    return str
}
function now() {
    return new Date().toTimeString()
}