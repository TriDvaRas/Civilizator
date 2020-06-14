
const fs = require('fs');
module.exports = {
    name: 'help',
    description: 'View bot command list',
    usage: '`help`',
    execute: async function (message, args) {
        message.delete({timeout:30000});
        let text=`    **Civilizator Commands**\n\n      **Standard Commands**\n`
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
        message.reply("sent help to your DM").then(msg=>msg.delete({timeout:30000}));
        message.author.createDM().then(dm=>{
            dm.send(text);
        })
    },
};