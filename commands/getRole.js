
module.exports = {
    name: 'getrole',
    description: 'Gives you Civilized role if enabled on server',
    usage: `\`getrole\``,
    execute: function execute(message, args, guildConfig) {
        if (!guildConfig.allowGetrole) {
            message.channel.send(`\`getrole\` is disabled on this server`)
                .then(botMsg => {
                    message.delete({ timeout: 5000 })
                    botMsg.delete({ timeout: 5000 })
                })
            return;
        }
        if (message.member.roles.cache.some(role => role.id === guildConfig.roleId)) {
            message.reply(`you already have civilized role`)
                .then(botMsg => {
                    message.delete({ timeout: 10000 })
                    botMsg.delete({ timeout: 10000 })
                })
        }
        else {
            let role = message.guild.roles.cache.find(role => role.id === guildConfig.roleId);
            message.member.roles.add(role);
            message.channel.send(`Set \`${role.name}\` role to ${message.author}`)
        }
    },
};