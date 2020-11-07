
const GC = require("../functions/guildConfig.js");
module.exports = {
    name: 'getrole',
    description: 'Gives you Civilized role if enabled on server',
    usage: `\`getrole\``,
    execute: async function (message, args) {
        GC.getConfig(message.guild).then(config => {
            if (!config.allowGetRole) {
                message.channel.send(`\`getrole\` is disabled on this server`)
                    .then(botMsg => {
                        message.delete({ timeout: 5000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}] \n${err}`) })
                        botMsg.delete({ timeout: 5000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}] \n${err}`) })
                    })
                    .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                return;
            }

            if (!message.member.roles.cache.some(role => role.id === config.roleId)) {
                let role = message.guild.roles.cache.find(role => role.id === config.roleId);
                message.member.roles.add(role);
                message.channel.send(`${message.author} got \`${role.name}\` role`)
                    .then(botMsg => {
                        message.delete({ timeout: 10000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}] \n${err}`) })
                        botMsg.delete({ timeout: 10000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}] \n${err}`) })
                    })
                    .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
            } else {
                message.reply(`you already have a role`)
                    .then(botMsg => {
                        message.delete({ timeout: 10000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}] \n${err}`) })
                        botMsg.delete({ timeout: 10000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}] \n${err}`) })
                    })
                    .catch(err => { throw new Error(`reply [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
            }

        })


    },
};