
var Perm = require('./assets/functions/PermissionsFunctions.js');
module.exports = {
    name: 'createChannel',
    description: 'Creates civ channel accessible for users with role [roleName] (Admin)',
    usage: `\`!civ createChannel [roleName]\` ([roleName] is not a mention)`,
    execute:async function(message, args) {
        if (!Perm.checkRoles(message, "skip", true, false, false)) {
            message.reply("ахуел?(Admin only)");
            return;
        }
        let { channelName, roleName } = require('./config.json');
        if(args[0])
            roleName=args[0];
        
        if (!message.guild.channels.find(channel => channel.name === channelName)) {
            message.guild.createChannel(channelName, {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: message.guild.defaultRole.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: message.guild.roles.find(role => role.name === roleName).id,
                        allow: ['VIEW_CHANNEL'],
                    },
                ]
            });
            message.channel.send(`${message.author} created Civ channel`);
        } else {
            message.reply(`channel already exists`);
        }


    },
};