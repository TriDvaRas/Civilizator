
const GC = require("../assets/functions/guildConfig.js");
const Perm = require('../assets/functions/Permissions.js');
const logger = require("../logger");
const chalk = require('chalk');
module.exports = {
    name: 'getrole-',
    description: 'Disables \`getrole\` command (Admin)',
    usage: `\`getrole-\``,
    execute: async function (message, args) {
        try {
            Perm.checkRoles(message.member, null, { admin: true })
            .then(()=>{
                
                let config = GC.getConfig(message.guild);
                if (config.allowGetRole == false) {
                    message.delete({timeout:30000});
                    message.channel.send(`\`getrole\` is already disabled`).then(msg=>msg.delete({timeout:30000}));
                    return;
                }
                config.allowGetRole = false;
                GC.setConfig(message.guild, config);
                message.channel.send(`Disabled \`getrole\``);
                logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] disabled getrole`);

            })
            .catch(()=>{
                message.delete({timeout:30000});
                message.reply(`Server admin command`).then(msg=>msg.delete({timeout:30000}));
                return;
                
            })
        } catch (error) {
            message.delete({timeout:30000});
            message.channel.send(`Failed disabling \`getrole\``).then(msg=>msg.delete({timeout:30000}));
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] failed disabling getrole ${error}`);
        }

    }
};