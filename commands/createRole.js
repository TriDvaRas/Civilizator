
var Perm = require('../assets/functions/Permissions.js');
const { createBaseRole } = require('../assets/functions/Setup.js');
module.exports = {
    name: 'createrole',
    description: 'Creates role (Admin)',
    usage: `\`createrole\``,
    execute: async function (message, args) {
        if (!Perm.checkRoles(message.member, "skip", { admin: true })) {
            message.reply("ахуел?(Admin only)");
            return;
        }
        createBaseRole(message.guild, message)
            .then(role => {
                message.channel.send(`Successfuly created ${role.name} role`);
            }).catch(err => {
                message.channel.send(err);
            });
    },
};