
var Perm = require('../functions/Permissions.js');
const logger = require("../logger");
const GC = require(`../functions/guildConfig.js`);
const Discord = require('discord.js');
const db = require('../functions/db.js');
const mergeImg = require('merge-img');
const getBaseState = require(`../functions/baseState`)
const getCivList = require(`../functions/civList`)
module.exports = {
    name: 'fast',
    description: 'Fast game (original CivRandomizer) (has 1m cooldown)',
    usage: '`fast [game] <Players(1-16)> <CivPerPlayer(1-6)> [-/+] [DLCs to enable/disable]`\n [game] is optional argument to choose the game you play\n Available games: civ5(default), lek, civ6',
    example: `\`fast 4 3\` - civ5, 4 players 3 civs each, all DLCs enabled
\`fast 4 3 - bnw mon\` - civ5, 4 players 3 civs each, all DLCs except BNW and Mongolia enabled
\`fast civ6 4 3 + van korea\` - civ6, 4 players 3 civs each, only Vanilla and Korea enabled
\`fast lek 2 4\` - civ5 + lek mod, 2 players 4 civs each, all DLCs enabled`,
    execute: async function (message, args) {
        GC.getConfig(message.guild).then(
            config => {
                //check cd
                if (Date.now() - config.lastFast < globalThis.fastCD) {
                    message.channel.send(`Command is on cooldown. Try again later.`).then(botMsg => {
                        message.delete({ timeout: 5000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}]  \n${err}`) })
                        botMsg.delete({ timeout: 5000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}]  \n${err}`) })
                    }).catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })

                    return
                }
                //check perm
                Perm.checkRoles(message.member, null, { admin: true, civ: true })
                    .then(
                        () => {
                            //check game
                            let game;
                            if (gameNames.includes(args[0].toLowerCase())) {
                                game = args.shift().toLowerCase();

                            }
                            else
                                game = "civ5";
                            //check 0/1 args
                            if (args.length < 2 || !(args[0] >= 1 && args[0] <= 16 && args[1] >= 1 && args[1] <= 6)) {

                                message.channel.send(`Wrong arguments. Try \`${this.name} help\` `).then(botMsg => {
                                    message.delete({ timeout: 5000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}]  \n${err}`) })
                                    botMsg.delete({ timeout: 5000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}]  \n${err}`) })
                                }).catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })

                                return;
                            }

                            //get default state
                            let state = getBaseState(game ? game : `civ5`)
                            //check dlcs settings
                            let white;
                            if (args[2] == "+")
                                white = true;
                            else if (args[2] == "-")
                                white = false;
                            else if (args[2]) {
                                message.channel.send(`Wrong arguments. Try \`${this.name} help\` `).then(botMsg => {
                                    message.delete({ timeout: 5000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}]  \n${err}`) })
                                    botMsg.delete({ timeout: 5000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}]  \n${err}`) })
                                }).catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })

                                return;
                            }
                            //set dlcs
                            if (white != undefined) {
                                checkDLCs(state, args.slice(3), white);
                                checkCivs(state);
                            }
                            //check if enough civs 
                            if (state.Civs.length < +args[0] * +args[1]) {
                                message.channel.send(`Not enough civs for ${args[0]}x${args[1]} game`).then(botMsg => {
                                    message.delete({ timeout: 5000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}]  \n${err}`) })
                                    botMsg.delete({ timeout: 5000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}]  \n${err}`) })
                                }).catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })

                                return;
                            }
                            //send embed
                            message.channel.send(new Discord.MessageEmbed()
                                .setTitle(`Fast Game`)
                                .setColor('#66D018')
                                .setThumbnail(
                                    game == "civ5" ? 'https://tdr.s-ul.eu/HFuCvc8b' :
                                        game == "lek" ? 'https://tdr.s-ul.eu/HFuCvc8b' :
                                            game == "civ6" ? 'https://tdr.s-ul.eu/yNXGRctD' :
                                                "https://tdr.s-ul.eu/FYpCCEZi")
                                .addField(`DLCs`, state.disabledDLC.length == 0 ? `All` : state.DLCs.join(`\n`), true)
                                .addField(`Players`, args[0], true)
                                .addField(`CPP`, args[1], true)
                                .setTimestamp()
                                .setFooter('Created by TriDvaRas', 'https://tdr.s-ul.eu/hP8HuUCR')
                            ).catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })

                            //send civs
                            GeneratePicks(state, message.channel, +args[0], +args[1]);
                            db.setLastFast(message.guild)
                            db.addFastCount(message.guild)
                        },
                        err => {
                            logger.log(`error`, `${err}\n${err.stack}`);
                            message.channel.send("Civ role required").then(botMsg => {
                                message.delete({ timeout: 5000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}]  \n${err}`) })
                                botMsg.delete({ timeout: 5000 }).catch(err => { throw new Error(`delete [${message.guild.name}] [${message.channel.name}]  \n${err}`) })
                            }).catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })

                            return;
                        }
                    );
            },
            error => {
                logger.log(`error`, error)
            }
        );


    },
};
let fastid = 0;



function DisableDLC(DLC, state) {
    state.DLCs.splice(state.DLCs.findIndex(x => x == DLC), 1);
    state.disabledDLC.push(DLC);
}

function checkDLCs(state, args, white) {
    if (!white)
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            let dlc = state.DLCs.find(dlc => dlc.toLowerCase().includes(arg.toLowerCase()))
            if (dlc)
                DisableDLC(dlc, state);
        }
    else
        for (let i = state.DLCs.length - 1; i >= 0; i--) {
            const dlc = state.DLCs[i];
            if (!args.find(arg => dlc.toLowerCase().includes(arg.toLowerCase())))
                DisableDLC(dlc, state);
        }

}
function checkCivs(state) {
    const CivList = getCivList(state.game)
    let newCivs = [];
    state.Civs.forEach(Civ => {
        civObj = CivList.find(C => C.id == Civ);
        if (state.disabledDLC.includes(civObj.DLC))
            state.disabled.push(Civ);
        else
            newCivs.push(Civ);
    });
    state.Civs = newCivs;
}
//gen and send all picks
function GeneratePicks(state, channel, players, cpp) {
    let indexes = [];
    for (let i = 0; i < players; i++)
        indexes.push(i)

    shuffle(indexes);
    indexes.forEach(i => {
        GetCivLine(state, channel, i, cpp);
    });



}
//get player civ set
function GetCivLine(state, channel, i, cpp) {
    var CivList = getCivList(state.game)
    let txt = `Player ${i + 1}:\n`;
    images = [];
    for (let i = 0; i < cpp; i++) {
        let Id = GetRandomCivId(state);
        txt += `${CivList[Id - 1].Name}/`;
        images.push(`./assets/${CivList[Id - 1].picPath}`);
    }
    mergeImg(images)
        .then((img) => {
            let imgid = fastid;
            fastid++;
            if (fastid > 32)
                fastid = 0;
            img.write(`./assets/Imgs/Players/fast${imgid}.png`, () => {
                channel.send(txt.slice(0, -1), {
                    files: [`./assets/Imgs/Players/fast${imgid}.png`]
                }).catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })

            });

        },
            err => {
                logger.log(`error`, `mergeImg error\n${err}`)
                let imgid = fastid;
                fastid++;
                if (fastid > 32)
                    fastid = 0;
                img.write(`./assets/Imgs/Players/fast${imgid}.png`, () => {
                    channel.send(`${txt.slice(0, -1)} [failed to add images]`).catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                });
            }
        );
    if (state.repeat == true)
        for (let i = state.picked.length - 1; i >= 0; i--) {
            state.Civs.push(state.picked.splice(i, 1)[0]);
        }
}
//civ id from pool
function GetRandomCivId(state) {//Pool, RemoveFromPool
    i = getRandomInt(0, state.Civs.length - 1);
    n = state.Civs[i];
    state.picked.push(state.Civs.splice(i, 1)[0]);
    return n;
}
//rng
function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max - min));
}
//array shuffle
function shuffle(Players) {
    for (let i = Players.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [Players[i], Players[j]] = [Players[j], Players[i]];
    }
}
