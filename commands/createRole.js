
var Perm = require('../assets/functions/Permissions.js');
const { createBaseRole } = require('../assets/functions/Setup.js');
module.exports = {
    name: 'createrole',
    description: 'Creates role (Admin)',
    usage: `\`createrole\``,
    execute: async function (message, args) {
        Perm.checkRoles(message.member, null, { admin: true })
            .then(() => {

                createBaseRole(message.guild, false)
                    .then(role => {
                        message.channel.send(`Successfuly created ${role.name} role`);
                    },
                        err => {
                            message.channel.send(err);
                        }
                    );

            },
                () => {
                    message.reply("Server admin command");
                    return;

                }
            );
    },
};