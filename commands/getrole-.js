
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
                            message.delete({ timeout: 30000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                            message.channel.send(`\`getrole\` is already disabled`)
                                .then(msg => msg.delete({ timeout: 30000 }))
                                .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                            return;
                        }
                        config.allowGetRole = false;
                        GC.setConfig(message.guild, config);
                        message.channel.send(`Disabled \`getrole\``)
                            .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] disabled getrole`);

                    })

                },
                    () => {
                        message.delete({ timeout: 30000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                        message.channel.send(`Server admin command`)
                            .then(msg => msg.delete({ timeout: 30000 }))
                            .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                        return;

                    }
                );
        } catch (error) {
            message.delete({ timeout: 30000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
            message.channel.send(`Failed disabling \`getrole\``)
                .then(msg => msg.delete({ timeout: 30000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)}))
                .catch(err => {throw new Error(`send [${message.guild.name}] [${message.author.tag}] \n${err}`)})
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] failed disabling getrole ${error}`);
        }

    }
};