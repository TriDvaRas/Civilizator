
var Perm = require('../assets/functions/Permissions.js');
const { createBaseChannel } = require('../assets/functions/Setup.js');
module.exports = {
    name: 'createchannel',
    description: 'Create Civilizator channel (Admin)',
    usage: `\`createChannel\``,
    execute: async function (message, args) {
        Perm.checkRoles(message.member, null, { admin: true })
            .then(() => {

                createBaseChannel(message.guild, undefined, { message: message })
                    .then(channel => {
                        message.channel.send(`Successfuly created ${channel}`)
                    },
                        err => {
                            message.channel.send(err)
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