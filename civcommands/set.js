const GC = require(`../assets/functions/guildConfig.js`);
var Perm = require('../assets/functions/Permissions.js');
const Embeder = require("../assets/functions/embeder.js");
const logger = require("../logger");
const chalk = require('chalk');

module.exports = {
    name: 'set',
    description: 'change current game settings',
    usage: `\`set bans <0-4>\` - change bans per player 
\`set civs <1-6>\` - change civs per player
`,
    execute: function (message, args) {
        message.delete({ timeout: 5000 });
        GC.getGameState(message.guild).then(state => {

            Perm.checkRoles(message.member, state.Op, { admin: true, op: true })
                .then(() => {
                    if (!state.started) {
                        message.reply("`start` game first").then(m => m.delete({ timeout: 5000 }));
                        return;
                    }
                    if (state.Phase != "join") {
                        message.reply("You can change game settings only during join phase").then(m => m.delete({ timeout: 5000 }));
                        return;
                    }
                    let embed;
                    switch (args[0]) {
                        case "b":
                        case "bans":
                            let newBans = parseInt(args[1]);
                            if (!newBans) {
                                message.reply(`Wrong arguments\n Try \`set help\``).then(m => m.delete({ timeout: 5000 }));
                                break;
                            }
                            state.banSize = Math.min(Math.max(newBans, 0), 4);
                            message.channel.send(`Set BPP to ${state.banSize}`)
                            GC.setGameState(message.guild, state);
                            embed = Embeder.get(state, message.channel);
                            embed.fields.find(field => field.name == "Bans per player").value = `${state.banSize}` + '\u200B';
                            Embeder.set(state, message.channel, embed)
                            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] changed bans to ${state.banSize}`);
                            break;
                        case "c":
                        case "civs":
                            let newCivs = parseInt(args[1]);
                            if (!newCivs) {
                                message.reply(`Wrong arguments\n Try \`set help\``).then(m => m.delete({ timeout: 5000 }));
                                break;
                            }
                            state.playerSize = Math.min(Math.max(newCivs, 1), 6);
                            message.channel.send(`Set CPP to ${state.playerSize}`)
                            GC.setGameState(message.guild, state);
                            embed = Embeder.get(state, message.channel);
                            embed.fields.find(field => field.name == "Civs per player").value = `${state.playerSize}` + '\u200B';
                            Embeder.set(state, message.channel, embed)
                            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] changed civs to ${state.playerSize}`);
                            break;
                        default:
                            message.reply(`Wrong arguments\n Try \`set help\``).then(m => m.delete({ timeout: 5000 }));
                            break;
                    }
                },
                    () => {
                        message.reply("Operator command").then(m => m.delete({ timeout: 5000 }));
                        return;

                    })

        },
            error => logger.log(`error`, `${error}`)
        )

    },
};