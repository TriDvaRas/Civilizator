
const Perm = require('../functions/Permissions.js');
const { createBaseRole } = require('../functions/Setup.js');
module.exports = {
    name: 'createrole',
    description: 'Creates role (Admin)',
    usage: `\`createrole\``,
    execute: function execute(message, args, guildConfig) {
        if (Perm.checkRoles(guildConfig, message.member, null, { admin: true })) {
            createBaseRole(message.guild, false).then(
                role => {
                    message.channel.send(`Successfuly created ${role.name} role`)
                },
                err => {
                    message.channel.send(err)
                }
            );

        }
        else {
            message.channel.send("Server admin command").then(msg => msg.delete({ timeout: 5000 }))
        }

    },
};