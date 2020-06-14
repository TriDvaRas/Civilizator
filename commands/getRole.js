
const GC = require("../assets/functions/guildConfig.js");
module.exports = {
    name: 'getrole',
    description: 'Gives you Civilized role if enabled on server',
    usage: `\`getrole\``,
    execute: async function (message, args) {
        let config = GC.getConfig(message.guild);
        if (!config.allowGetRole) {
            message.channel.send(`\`getrole\` is disabled on this server`)
                .then(botMsg => {
                    message.delete({ timeout: 5000 });
                    botMsg.delete({ timeout: 5000 });
                });
            return;
        }

        if (!message.member.roles.cache.some(role => role.id === config.roleId)) {
            let role = message.guild.roles.cache.find(role => role.name === roleName);
            message.member.roles.add(role);
            message.channel.send(`${message.author} got \`${role.name}\` role`)
                .then(botMsg => {
                    message.delete({ timeout: 10000 });
                    botMsg.delete({ timeout: 10000 });
                });
        } else {
            message.channel.send(`${message.author} already have a role`)
                .then(botMsg => {
                    message.delete({ timeout: 10000 });
                    botMsg.delete({ timeout: 10000 });
                });
        }


    },
};