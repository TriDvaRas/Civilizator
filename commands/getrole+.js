
const GC = require("../functions/guildConfig.js");
const Perm = require('../functions/Permissions.js');
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
                            message.delete({ timeout: 30000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}] \n${err}`) })
                            message.channel.send(`\`getrole\` is already enabled`)
                                .then(msg => msg.delete({ timeout: 30000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}] \n${err}`) }))
                                .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                            return;
                        }
                        config.allowGetRole = true;
                        GC.setConfig(message.guild, config);
                        message.channel.send(`Enabled \`getrole\``)
                            .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] Enabled getrole`);

                    })

                },
                    () => {
                        message.delete({ timeout: 30000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}] \n${err}`) })
                        message.channel.send(`Server admin command`)
                            .then(msg => msg.delete({ timeout: 30000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}] \n${err}`) }))
                            .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                        return;

                    }
                );

        } catch (error) {
            message.delete({ timeout: 30000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}] \n${err}`) })
            message.channel.send(`Failed enabling \`getrole\``)
                .then(msg => msg.delete({ timeout: 30000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}] \n${err}`) }))
                .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] failed enabling getrole ${error}`);
        }

    }
};