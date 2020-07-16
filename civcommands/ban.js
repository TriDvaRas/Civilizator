var IO = require('../assets/functions/IO.js');
const GC = require(`../assets/functions/guildConfig.js`);
var BanF = require('../assets/functions/BansFunctions.js');
const Embeder = require("../assets/functions/embeder.js");
const logger = require("../logger");
const chalk = require('chalk');
module.exports = {
    name: 'ban',
    description: 'Bans Civilization by id or alias',
    usage: '`ban <Id/Alias>`',
    execute: function (message, args) {
        message.delete({ timeout: 5000 });
        //read GameState
        GC.getGameState(msg.guild).then(state => {
            //check phase
            if (state.started != true) {
                message.channel.send("`start` game first").then(botMsg => {
                    botMsg.delete({ timeout: 5000 });
                });
                return;
            } else if (state.Phase != "bans") {
                message.channel.send("Wrong phase").then(botMsg => {
                    botMsg.delete({ timeout: 5000 });
                });
                return;

            } else {
                //lowercase args
                args.forEach(x => {
                    x = x.toLowerCase();
                });
                //check if Player can ban
                if (!BanF.CheckCanBan(state, message)) {
                    message.reply("Out of bans").then(botMsg => {
                        botMsg.delete({ timeout: 5000 });
                    });
                    return;
                }
                for (let j = 0; j < args.length && BanF.CheckCanBan(state, message); j++) {
                    let arg = args[j];
                    //read list
                    var CivList = IO.Read('./assets/CivList.json');

                    //find civ by id
                    C = CivList.find(civ => civ.id == arg);

                    // if not found by id
                    if (!C) {
                        C = [];
                        //find all aliases
                        CivList.forEach(civ => {
                            if (BanF.includesIgnoreCase(civ.Alias, arg))
                                C.push(civ);
                        });
                        //check if multiple
                        if (C.length > 1) {
                            let txt = `Multiple aliases for \`${arg}\`:`;
                            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${txt}`);
                            C.forEach(civ => {
                                txt += `\n${civ.id}. ${civ.Alias.join(` - `)}`
                            });
                            message.channel.send(txt).then(botMsg => {
                                botMsg.delete({ timeout: 7000 });
                            });;
                            continue;
                        }
                        else if (C.length == 0) {
                            let txt = `No aliases found for \`${arg}\``;
                            logger.log(`cmd`, txt);
                            message.channel.send(txt).then(botMsg => {
                                botMsg.delete({ timeout: 7000 });
                            });;
                            continue;

                        }
                        if (C.length == 1)
                            C = C[0];

                    }


                    //if found 
                    if (C) {
                        //check if banned
                        if (!BanF.CheckBanned(state, C)) {
                            let player = state.Players.find(u => u.id == `${message.author}`);
                            if (player.bans.length >= state.banSize) {
                                message.reply(`Out of bans`).then(botMsg => {
                                    botMsg.delete({ timeout: 10000 });
                                });
                                return;
                            }
                            BanF.Ban(C, state);
                            state.Banners.push(`${message.author}`);
                            state.Players.find(user => user.id == `${message.author}`).bans.push(C);
                            message.channel.send(`${message.author} banned ${C.Name} (${C.id})\nBans: ${state.bansActual}/${state.bansFull}`, {
                                files: [`./assets/${C.picPath}`]
                            }).then(botMsg => {
                                botMsg.delete({ timeout: 10000 });
                            });
                            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] banned ${C.Name} [${state.bansActual}/${state.bansFull}]`);
                            let embed = Embeder.get(state, message.channel);
                            embed.fields.find(field => field.name == "Bans").value = state.Players.map(user => `[${user.bans.length}/${state.banSize}]`).join('\n') + '\u200B';
                            embed.fields.find(field => field.name == "Banned civs").value = state.banned.map(id => CivList.find(x => x.id == id).Name).join('\n') + '\u200B';
                            Embeder.set(state, message.channel, embed)
                            GC.setGameState(message.guild, state);
                            if (state.bansActual >= state.bansFull) {
                                let msg = message.channel.messages.cache.array().find(msg => msg.id == state.embedId);
                                logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] Last ban, proceeding to picks`);
                                msg.react(`✔️`);
                            }

                        } else {
                            message.reply(`${C.Name} (${C.id}) is already banned `, {
                                files: [`./assets/${C.picPath}`]
                            }).then(botMsg => {
                                botMsg.delete({ timeout: 5000 });
                            });
                        }
                    }
                }

            }
        }).catch(error => logger.log(`error`, `${error}`))


    },
};