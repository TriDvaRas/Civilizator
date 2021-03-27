
const Perm = require('../functions/Permissions.js');
const { createBaseChannel } = require('../functions/Setup.js');
module.exports = {
    name: 'createchannel',
    description: 'Create Civilizator channel (Admin)',
    usage: `\`createChannel\``,
    execute: function execute(message, args, guildConfig) {
        if (Perm.checkRoles(guildConfig, message.member, null, { admin: true })) {
            createBaseChannel(message.guild, null, { message: message })
                .then(
                    channel => {
                        message.channel.send(`Successfuly created ${channel}`)
                    },
                    err => {
                        message.channel.send(err)
                    }
                );
        }
        else {
            message.channel.send("Server admin command")
        }

    },
};