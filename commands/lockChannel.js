//imports
var Perm = require('../assets/functions/Permissions.js');
const GC = require(`../assets/functions/guildConfig.js`);
module.exports = {
    name: 'lockchannel',
    description: 
`Change channel lock to this channel  (Admin)
*Civilization commands only work in locked channel*`,
    usage: `\`lockchannel\``,
    execute: async function (message, args) {
        if (!Perm.checkRoles(message.member, null, { admin: true })) {
            message.reply("Server admin command");
            return;
        }
        let config=GC.getConfig(message.guild);
        config.channelId=message.channel.id;
        GC.setConfig(message.guild,config);
        message.channel.send(`Bound bot to ${message.channel} ✅`);

    },
}