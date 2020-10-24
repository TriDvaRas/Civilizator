
const GC = require("../functions/guildConfig.js");
module.exports = {
    name: 'getrole',
    description: 'Gives you Civilized role if enabled on server',
    usage: `\`getrole\``,
    execute: async function (message, args) {
        GC.getConfig(message.guild).then(config=>{
            if (!config.allowGetRole) {
                message.channel.send(`\`getrole\` is disabled on this server`).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                    .then(botMsg => {
                        message.delete({ timeout: 5000 });
                        botMsg.delete({ timeout: 5000 });
                    });
                return;
            }
    
            if (!message.member.roles.cache.some(role => role.id === config.roleId)) {
                let role = message.guild.roles.cache.find(role => role.id === config.roleId);
                message.member.roles.add(role);
                message.channel.send(`${message.author} got \`${role.name}\` role`).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                    .then(botMsg => {
                        message.delete({ timeout: 10000 });
                        botMsg.delete({ timeout: 10000 });
                    });
            } else {
                message.reply(`you already have a role`)
                    .then(botMsg => {
                        message.delete({ timeout: 10000 });
                        botMsg.delete({ timeout: 10000 });
                    }).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
            }
            
        })


    },
};