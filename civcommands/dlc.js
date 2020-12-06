//imports 

const GC = require(`../functions/guildConfig.js`);
var Perm = require('../functions/Permissions.js');
var IO = require('../functions/IO.js');
const Embeder = require("../functions/embeder.js");
const getCivList = require(`../functions/civList`)
const logger = require("../logger");
const chalk = require('chalk');
module.exports = {
    name: 'dlc',
    description: 'Manage DLCs (Operator)',
    usage:
        `\`dlc <whitelist/white/w/+> <DLCs>\` disables all DLCs which are not in <DLCs>
\`dlc <blacklist/black/b/-> <DLCs>\` disables all DLCs which are in <DLCs>
\`dlc <reset/r>\` enables all DLCs`,
    execute: function (message, args) {
        message.delete({ timeout: 5000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
        //read GameState
        GC.getGameState(message.guild).then(state => {
            Perm.checkRoles(message.member, state.Op, { admin: true, op: true })
                .then(() => {
                    //check phase
                    if (state.started != true) {
                        message.channel.send("`start` game first").then(botMsg => {
                            botMsg.delete({ timeout: 5000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                        }).catch(err => {throw new Error(`send [${message.guild.name}] [${message.author.tag}] \n${err}`)})
                        return;
                    } else if (state.Phase != "join") {
                        message.channel.send("Wrong phase").then(botMsg => {
                            botMsg.delete({ timeout: 5000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                        }).catch(err => {throw new Error(`send [${message.guild.name}] [${message.author.tag}] \n${err}`)})
                        return;

                    } else {

                        if (args[0] == "r" || args[0] == "reset") {
                            state.DLCs = state.DLCs.concat(state.disabledDLC);
                            state.disabledDLC = [];
                            state.Civs = state.Civs.concat(state.disabled);
                            state.disabled = [];
                            let embed = Embeder.get(state);
                            embed.fields.find(field => field.name == "DLCs").value = "All" + '\u200B';
                            Embeder.set(state, embed)
                            GC.setGameState(message.guild, state);
                            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] dlc => all`);
                            return;
                        }

                        if (!args[0] || !args[1]) {
                            message.channel.send(`Wrong arguments`).then(botMsg => {
                                botMsg.delete({ timeout: 5000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                            }).catch(err => {throw new Error(`send [${message.guild.name}] [${message.author.tag}] \n${err}`)})
                            return;
                        }
                        let white;
                        if (args[0] == "+" || args[0] == "w" || args[0] == "white" || args[0] == "whitelist")
                            white = true;
                        else if (args[0] == "-" || args[0] == "b" || args[0] == "black" || args[0] == "blacklist")
                            white = false;
                        else {
                            message.channel.send(`Wrong arguments`).then(botMsg => {
                                botMsg.delete({ timeout: 5000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                            }).catch(err => {throw new Error(`send [${message.guild.name}] [${message.author.tag}] \n${err}`)})
                            return;
                        }
                        args = args.slice(1);
                        checkDLCs(state, args, white);
                        checkCivs(state);
                        let embed = Embeder.get(state);
                        if (state.disabledDLC.length > 0) {
                            embed.fields.find(field => field.name == "DLCs").value = state.DLCs.join('\n') + '\u200B';
                            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] dlc => ${state.DLCs.join('\n')}`);
                        }
                        else if (state.disabledDLC.length == 0) {
                            embed.fields.find(field => field.name == "DLCs").value = "All" + '\u200B';
                            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] dlc => all`);
                        }
                        else {
                            embed.fields.find(field => field.name == "DLCs").value = "None" + '\u200B';
                            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] dlc => none`);
                        }
                        Embeder.set(state, embed);
                        GC.setGameState(message.guild, state);
                    }

                },
                    () => {
                        message.channel.send("Operator command").then(botMsg => {
                            botMsg.delete({ timeout: 5000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)})
                        }).catch(err => {throw new Error(`send [${message.guild.name}] [${message.author.tag}] \n${err}`)})
                        return;
                    })
        },
            error => logger.log(`error`, `${error}`)
        )
        //check if Player is OP


    },
};
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
        if (state.game == "Civ6" && civObj.persona) {
            if (state.DLCs.includes("PersonaPack"))
                if (civObj.id == civObj.persona)
                    state.disabled.push(Civ);
        }
        else if (state.disabledDLC.includes(civObj.DLC))
            state.disabled.push(Civ);
        else
            newCivs.push(Civ);
    });
    state.Civs = newCivs;
}