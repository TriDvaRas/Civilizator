
const GC = require("../functions/guildConfig.js");
const Perm = require('../functions/Permissions.js');
module.exports = {
    name: 'prefix',
    description: 'Change bot\'s prefix (Admin)',
    usage: '`prefix <new prefix>`',
    execute: async function (message, args) {
        Perm.checkRoles(message.member, null, { admin: true })
            .then(() => {
                if (!args[0] || [``, ` `].includes(args[0])) {
                    message.channel.send("Wrong arguments")
                        .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                    return;
                }
                try {
                    logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] changing prefix`);
                    GC.getConfig(message.guild).then(config => {
                        config.prefix = args[0];
                        GC.setConfig(message.guild, config);
                        message.channel.send(`Changed prefix to ${config.prefix}`)
                            .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] changed prefix to ${config.prefix}`);

                    })
                } catch (error) {
                    message.channel.send(`Failed to change prefix`)
                        .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                    logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] failed to change prefix ${error}`);
                }

            },
                () => {
                    message.channel.send("Server admin command")
                        .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                    return;

                }
            );

    },
};