
var Perm = require('../functions/Permissions.js');
const { createBaseChannel } = require('../functions/Setup.js');
module.exports = {
    name: 'createchannel',
    description: 'Create Civilizator channel (Admin)',
    usage: `\`createChannel\``,
    execute: async function (message, args) {
        Perm.checkRoles(message.member, null, { admin: true })
            .then(() => {

                createBaseChannel(message.guild, undefined, { message: message })
                    .then(channel => {
                        message.channel.send(`Successfuly created ${channel}`).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                            
                    },
                        err => {
                            message.channel.send(err).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                            
                        }
                    );

            },
                () => {
                    message.channel.send("Server admin command").catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                    return;

                }
            );
    },
};