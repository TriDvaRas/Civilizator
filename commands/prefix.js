
const GC = require("../assets/functions/guildConfig.js");
const Perm = require('../assets/functions/Permissions.js');
const logger = require("../logger");
const chalk = require('chalk');
module.exports = {
    name: 'prefix',
    description: 'Change bot\'s prefix',
    usage: '`prefix <new prefix>`',
    execute: async function (message, args) {
        if (!Perm.checkRoles(message.member, null, { admin: true })) {
            message.reply("Server admin command");
            return;
        }
        if (!args[0] || [``, ` `].includes(args[0])) {
            message.reply("Wrong arguments");
            return;
        }
        try {
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] changing prefix`);
            let config = GC.getConfig(message.guild)
            config.prefix = args[0];
            GC.setConfig(message.guild, config);
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] changed prefix to ${config.prefix}`);
        } catch (error) {
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] failed to change prefix ${error}`);
        }
    },
};