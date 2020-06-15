
const GC = require("../assets/functions/guildConfig.js");
const Perm = require('../assets/functions/Permissions.js');
const logger = require("../logger");
const chalk = require('chalk');
module.exports = {
    name: 'getrole+',
    description: 'Enables \`getrole\` command (Admin)',
    usage: `\`getrole+\``,
    execute: async function (message, args) {
        try {
            if (!Perm.checkRoles(message.member, null, { admin: true })) {
                message.delete({timeout:30000});
                message.reply(`Server admin command`).then(msg=>msg.delete({timeout:30000}));
                return;
            }
            let config = GC.getConfig(message.guild);
            if (config.allowGetRole == true) {
                message.delete({timeout:30000});
                message.channel.send(`\`getrole\` is already enabled`).then(msg=>msg.delete({timeout:30000}));
                return;
            }
            config.allowGetRole = true;
            GC.setConfig(message.guild, config);
            message.channel.send(`Enabled \`getrole\``);
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] Enabled getrole`);
        } catch (error) {
            message.delete({timeout:30000});
            message.channel.send(`Failed enabling \`getrole\``).then(msg=>msg.delete({timeout:30000}));
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] failed enabling getrole ${error}`);
        }

    }
};