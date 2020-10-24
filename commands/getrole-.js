
const GC = require("../functions/guildConfig.js");
const Perm = require('../functions/Permissions.js');
const logger = require("../logger");
const chalk = require('chalk');
module.exports = {
    name: 'getrole-',
    description: 'Disables \`getrole\` command (Admin)',
    usage: `\`getrole-\``,
    execute: async function (message, args) {
        try {
            Perm.checkRoles(message.member, null, { admin: true })
                .then(() => {

                    GC.getConfig(message.guild).then(config => {
                        if (config.allowGetRole == false) {
                            message.delete({ timeout: 30000 });
                            message.channel.send(`\`getrole\` is already disabled`).then(msg => msg.delete({ timeout: 30000 })).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                            return;
                        }
                        config.allowGetRole = false;
                        GC.setConfig(message.guild, config);
                        message.channel.send(`Disabled \`getrole\``).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] disabled getrole`);

                    })

                },
                    () => {
                        message.delete({ timeout: 30000 });
                        message.channel.send(`Server admin command`).then(msg => msg.delete({ timeout: 30000 })).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                        return;

                    }
                );
        } catch (error) {
            message.delete({ timeout: 30000 });
            message.channel.send(`Failed disabling \`getrole\``).then(msg => msg.delete({ timeout: 30000 })).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] failed disabling getrole ${error}`);
        }

    }
};