var IO = require('../functions/IO.js');
const GC = require(`../functions/guildConfig.js`);
var BanF = require('../functions/BansFunctions.js');
const Embeder = require("../functions/embeder.js");
const getCivList = require(`../functions/civList`)
const logger = require("../logger");
const chalk = require('chalk');
module.exports = {
    name: 'ban',
    description: 'Bans Civilization by id or alias',
    usage: '`ban <Id/Alias>`',
    execute: function (message, args) {
        message.delete({ timeout: 5000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
        //read GameState
        GC.getGameState(message.guild).then(state => {
            //check phase
            if (state.started != true) {
                message.channel.send("`start` game first")
                    .then(botMsg => {
                        botMsg.delete({ timeout: 5000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                    })
                    .catch(err => {throw new Error(`send [${message.guild.name}] [${message.author.tag}] \n${err}`)})
                return;
            } else if (state.Phase != "bans") {
                message.channel.send("Wrong phase")
                    .then(botMsg => {
                        botMsg.delete({ timeout: 5000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                    })
                    .catch(err => {throw new Error(`send [${message.guild.name}] [${message.author.tag}] \n${err}`)})
                return;

            } else {
                //lowercase args
                args.forEach(x => {
                    x = x.toLowerCase();
                });
                //check if Player can ban
                if (!BanF.CheckCanBan(state, message)) {
                    message.channel.send("Out of bans").then(botMsg => {
                        botMsg.delete({ timeout: 5000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                    }).catch(err => {throw new Error(`send [${message.guild.name}] [${message.author.tag}] \n${err}`)})
                    return;
                }
                for (let j = 0; j < args.length && BanF.CheckCanBan(state, message); j++) {
                    let arg = args[j];
                    //read list
                    var CivList = getCivList(state.game)

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
                            message.channel.send(txt)
                                .then(botMsg => {
                                    botMsg.delete({ timeout: 7000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                                })
                                .catch(err => {err.message+=`s[${message.guild.name}] [${message.author.tag}]`; throw err})
                                continue;
                        }
                        else if (C.length == 0) {
                            let txt = `No aliases found for \`${arg}\``;
                            logger.log(`cmd`, txt);
                            message.channel.send(txt)
                                .then(botMsg => {
                                    botMsg.delete({ timeout: 7000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                                })
                                .catch(err => {throw new Error(`send [${message.guild.name}] [${message.author.tag}] \n${err}`)})
                            continue;

                        }
                        if (C.length == 1)
                            C = C[0];

                    }


                    //if found 
                    if (C) {
                        //check if banned
                        if (BanF.CheckBanned(state, C)) {
                            message.channel.send(`${C.Name} (${C.id}) is already banned `, {
                                files: [`./assets/${C.picPath}`]
                            }).then(botMsg => {
                                botMsg.delete({ timeout: 5000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                            }).catch(err => { err.message += ` [${message.guild.name}] [${message.author.tag}]`; throw err })
                        }
                        else if (BanF.CheckDisabled(state, C)) {
                            message.channel.send(`${C.Name} (${C.id}) is already disabled by DLCs settings`, {
                                files: [`./assets/${C.picPath}`]
                            }).then(botMsg => {
                                botMsg.delete({ timeout: 5000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                            }).catch(err => { err.message += ` [${message.guild.name}] [${message.author.tag}]`; throw err })
                        }
                        else {
                            let player = state.Players.find(u => u.id == `${message.author}`);
                            if (player.bans.length >= state.banSize) {
                                message.channel.send(`Out of bans`).then(botMsg => {
                                    botMsg.delete({ timeout: 10000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                                }).catch(err => { err.message += ` [${message.guild.name}] [${message.author.tag}]`; throw err })
                                return;
                            }
                            BanF.Ban(C, state);
                            state.Banners.push(`${message.author}`);
                            state.Players.find(user => user.id == `${message.author}`).bans.push(C);
                            message.channel.send(`${message.author} banned ${C.Name} (${C.id})\nBans: ${state.bansActual}/${state.bansFull}`, {
                                files: [`./assets/${C.picPath}`]
                            }).then(botMsg => {
                                botMsg.delete({ timeout: 10000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                            })
                                .catch(err => { err.message += ` [${message.guild.name}] [${message.author.tag}]`; throw err })
                            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] banned ${C.Name} [${state.bansActual}/${state.bansFull}]`);
                            let embed = Embeder.get(state);
                            embed.fields.find(field => field.name == "Bans").value = state.Players.map(user => `[${user.bans.length}/${state.banSize}]`).join('\n') + '\u200B';
                            embed.fields.find(field => field.name == "Banned civs").value = state.banned.map(id => CivList.find(x => x.id == id).Name).join('\n') + '\u200B';
                            Embeder.set(state, embed)
                            GC.setGameState(message.guild, state);
                            if (state.bansActual >= state.bansFull) {
                                let msg = message.channel.messages.cache.array().find(msg => msg.id == state.embedId);
                                logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] Last ban, proceeding to picks`);
                                msg.react(`✔️`).catch(err => { err.message += ` ✔️[${message.guild.name}] [${message.channel.name}]`; throw new Error(err) })
                            }
                        }
                    }
                }

            }
        },
            error => logger.log(`error`, `${error}`)
        )


    },
};