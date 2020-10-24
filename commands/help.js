
const fs = require('fs');
module.exports = {
    name: 'help',
    description: 'View bot command list',
    usage: '`help`',
    execute: async function (message, args) {
        message.delete({timeout:30000});
        let text=`**List of Civilizator bot Commands**\nAll commands start with prefix(default \`!\`) or bot mention\nTo get more info about a specific command use \`<command> help\` (e.g. \`start help\`)\n\n      **Standard Commands**\n`
        const commands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        for (const file of commands) {
            const command = require(`../commands/${file}`);
            text+=`\`${command.name}\` - ${command.description}\n`
        }
        text+=`\n      **Civilization Commands**\n`
        const civCommands = fs.readdirSync('./civcommands').filter(file => file.endsWith('.js'));
        for (const file of civCommands) {
            const command = require(`../civcommands/${file}`);
            text+=`\`${command.name}\` - ${command.description}\n`
        }
        message.channel.send("sent help to your DM").then(msg=>msg.delete({timeout:30000})).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`));
        message.author.createDM().then(dm=>{
            dm.send(text).catch(err => logger.log(`error`, `[DM] [${chalk.magentaBright(message.author.tag)}] ${err}`))
        })
    },
};