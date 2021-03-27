//imports
const db = require(`../functions/db`)
const Perm = require('../functions/Permissions.js');
module.exports = {
    name: 'lockchannel',
    description:
        `Change channel lock to this channel  (Admin)
*Civilization commands only work in locked channel*`,
    usage: `\`lockchannel\``,
    execute: function execute(message, args, guildConfig) {
        if (Perm.checkRoles(guildConfig, message.member, null, { admin: true })) {
            db.updateGuildConfig(message.guild, guildConfig, { channelId: message.channel.id })
            message.channel.send(`Bound bot to ${message.channel} ✅`)
        }
        else {
            message.channel.send("Server admin command")
        }
    },
}