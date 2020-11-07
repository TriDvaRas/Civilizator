
var Perm = require('../functions/Permissions.js');
const { createBaseRole } = require('../functions/Setup.js');
module.exports = {
    name: 'createrole',
    description: 'Creates role (Admin)',
    usage: `\`createrole\``,
    execute: async function (message, args) {
        Perm.checkRoles(message.member, null, { admin: true })
            .then(() => {

                createBaseRole(message.guild, false)
                    .then(role => {
                        message.channel.send(`Successfuly created ${role.name} role`)
                            .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                    },
                        err => {
                            message.channel.send(err)
                                .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                        }
                    );

            },
                () => {
                    message.channel.send("Server admin command")
                        .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                    return;

                }
            );
    },
};