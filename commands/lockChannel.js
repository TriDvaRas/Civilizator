//imports
var Perm = require('../functions/Permissions.js');
const GC = require(`../functions/guildConfig.js`);
module.exports = {
    name: 'lockchannel',
    description:
        `Change channel lock to this channel  (Admin)
*Civilization commands only work in locked channel*`,
    usage: `\`lockchannel\``,
    execute: async function (message, args) {
        Perm.checkRoles(message.member, null, { admin: true })
            .then(() => {

                GC.getConfig(message.guild).then(config => {
                    config.channelId = message.channel.id;
                    GC.setConfig(message.guild, config);
                    message.channel.send(`Bound bot to ${message.channel} ✅`).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))

                })

            },
                () => {
                    message.channel.send("Server admin command").catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                    return;

                }
            );

    },
}