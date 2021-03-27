/*global logger chalk*/
const Perm = require('../functions/Permissions.js');
const db = require(`../functions/db`)
module.exports = {
    name: 'getrole-',
    description: 'Disables `getrole` command (Admin)',
    usage: `\`getrole-\``,
    execute: function execute(message, args, guildConfig) {
        try {
            if (Perm.checkRoles(guildConfig, message.member, null, { admin: true })) {
                if (guildConfig.allowGetrole == false) {
                    message.delete({ timeout: 30000 })
                    message.channel.send(`\`getrole\` is already disabled`)
                        .then(msg => msg.delete({ timeout: 30000 }))
                    return;
                }
                db.updateGuildConfig(message.guild, guildConfig, { allowGetrole: false })
                message.channel.send(`Disabled \`getrole\``)
                logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] disabled getrole`);
            }
            else {
                message.delete({ timeout: 30000 })
                message.channel.send(`Server admin command`)
                    .then(msg => msg.delete({ timeout: 30000 }))
            }
        }
        catch (error) {
            message.delete({ timeout: 30000 })
            message.channel.send(`Failed disabling \`getrole\``)
                .then(msg => msg.delete({ timeout: 30000 }))
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] failed disabling getrole ${error}`);
        }

    }
};