/*global logger chalk*/
const db = require(`../functions/db`)
const Perm = require('../functions/Permissions.js');
module.exports = {
    name: 'prefix',
    description: 'Change bot\'s prefix (Admin)',
    usage: '`prefix <new prefix>`',
    execute: function execute(message, args, guildConfig) {
        if (Perm.checkRoles(guildConfig, message.member, null, { admin: true })) {
            if (!args[0] || args[0].length == 0) {
                message.channel.send(`Wrong arguments. Try \`${this.name} help\` `)
                return;
            }
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] changing prefix`)
            db.updateGuildConfig(message.guild, guildConfig, { prefix: args[0] })
            message.channel.send(`Changed prefix to \`${args[0]}\``)
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] changed prefix to ${args[0]}`)
        }
        else {
            message.channel.send("Server admin command")
        }
    },
};