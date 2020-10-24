
const GC = require("../functions/guildConfig.js");
const Perm = require('../functions/Permissions.js');
const logger = require("../logger");
const chalk = require('chalk');
module.exports = {
    name: 'getrole+',
    description: 'Enables \`getrole\` command (Admin)',
    usage: `\`getrole+\``,
    execute: async function (message, args) {
        try {
            Perm.checkRoles(message.member, null, { admin: true })
                .then(() => {
                    GC.getConfig(message.guild).then(config => {
                        if (config.allowGetRole == true) {
                            message.delete({ timeout: 30000 });
                            message.channel.send(`\`getrole\` is already enabled`).then(msg => msg.delete({ timeout: 30000 })).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                            return;
                        }
                        config.allowGetRole = true;
                        GC.setConfig(message.guild, config);
                        message.channel.send(`Enabled \`getrole\``).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] Enabled getrole`);

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
            message.channel.send(`Failed enabling \`getrole\``).then(msg => msg.delete({ timeout: 30000 })).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] failed enabling getrole ${error}`);
        }

    }
};