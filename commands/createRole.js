
var Perm = require('../assets/functions/PermissionsFunctions.js');
module.exports = {
    name: 'createRole',
    description: 'Creates [roleName] role (Admin)',
    usage: `\`!civ createRole [roleName]\` (defalult name is \`Civilized\`)`,
    execute: async function (message, args) {
        if (!Perm.checkRoles(message, "skip", true, false, false)) {
            message.reply("ахуел?(Admin only)");
            return;
        }
        const { roleName } = require('./config.json');
        if (!message.guild.roles.cache.some(role => role.name === roleName)) {
            message.guild.roles.create({
                data: {
                    name: roleName,
                    mentionable: true,
                    color: [64, 255, 159]
                }
            });
            message.channel.send(`${message.author} created \`${roleName}\` role`);
        } else {
            message.reply(`role already exists`);
        }


    },
};