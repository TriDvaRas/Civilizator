/* global discordClient */
const fs = require('fs');
module.exports = {
    name: 'help',
    description: 'View bot command list',
    allowDM: true,
    usage: '`help`',
    execute: function execute(message, args, guildConfig) {
        let text = `**List of Civilizator bot Commands**\nAll commands start with prefix(default \`!\`) or bot mention(<@${discordClient.user}>)\nTo get more info about a specific command use \`<command> help\` (e.g. \`start help\`)\n\n      **Standard Commands**\n`
        text += `${discordClient.commands.map(command => `\`${command.name}\` - ${command.description}\n`).join(``)}
      **Civilization Commands**\n${discordClient.civcommands.map(command => `\`${command.name}\` - ${command.description}\n`).join(``)}`

        message.author.createDM().then(
            dm => {
                dm.send(text).then(
                    () => {
                        message.delete({ timeout: 30000 })
                        message.reply(`Sent help to your DM`)
                            .then(msg => msg.delete({ timeout: 30000 }))
                    },
                    err => {
                        message.reply(`Can't sent help to your DM: \`${err.message}\`\nSending to this channel`)
                        message.channel.send(text)
                    })
            },
            err => {
                message.reply(`Can't sent help to your DM: \`${err.message}\`\nSending to this channel`)
                message.channel.send(text)
            })
    },
};