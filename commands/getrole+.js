/*global logger chalk*/
const db = require(`../functions/db`)
const Perm = require('../functions/Permissions.js');
module.exports = {
    name: 'getrole+',
    description: 'Enables `getrole` command (Admin)',
    usage: `\`getrole+\``,
    execute: function execute(message, args, guildConfig) {
        try {
            if (Perm.checkRoles(guildConfig, message.member, null, { admin: true })) {
                if (guildConfig.allowGetrole == true) {
                    message.delete({ timeout: 30000 })
                    message.channel.send(`\`getrole\` is already enabled`)
                        .then(msg => msg.delete({ timeout: 30000 }))
                    return;
                }
                db.updateGuildConfig(message.guild, guildConfig, { allowGetrole: true })
                message.channel.send(`Enabled \`getrole\``)
                logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] Enabled getrole`);
            }
            else {
                message.delete({ timeout: 30000 })
                message.channel.send(`Server admin command`)
                    .then(msg => msg.delete({ timeout: 30000 }))
            }
        }
        catch (error) {
            message.delete({ timeout: 30000 })
            message.channel.send(`Failed enabling \`getrole\``)
                .then(msg => msg.delete({ timeout: 30000 }))
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] failed enabling getrole ${error}`);
        }
    }
};