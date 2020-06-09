
module.exports = {
    name: 'getRole',
    description: 'Gives you civ role',
    usage: `\`!civ getRole\``,
    execute: async function (message, args) {
        const { roleName, deleteCommands } = require('./config.json');
        if (!message.member.roles.cache.some(role => role.name === roleName)) {
            message.member.roles.add(message.guild.roles.cache.find(role => role.name === roleName));
            message.channel.send(`${message.author} got \`${roleName}\` role`);
        } else {
            message.channel.send(`${message.author} already have a role`)
                .then(botMsg =>{
                    if(deleteCommands)
                        botMsg.delete({timeout:10000});
                });
        }


    },
};