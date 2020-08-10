
var Perm = require('../assets/functions/Permissions.js');
const logger = require("../logger");
const chalk = require('chalk');
var IO = require('../assets/functions/IO.js');
module.exports = {
    name: 'fast',
    description: 'Fast game (original CivRandomizer) (has 5m cooldown)',
    usage: '`fast <Players(1-16)> <CivPerPlayer(1-6)> [-/+] [DLCs to enable/disable]`',
    example: `\`fast 4 3\` - 4 players 3 civs each, all DLCs enabled
\`fast 4 3 - bnw mon\` - 4 players 3 civs each, all DLCs except BNW and Mongolia enabled
\`fast 4 3 + van korea\` - 4 players 3 civs each, only Vanilla and Korea enabled`,
    execute: async function (message, args) {

        //check perm
        Perm.checkRoles(message.member, null, { admin: true, civ: true })
            .then(() => {
                //check 0/1 args
                if (args.length < 2 || !(args[0] >= 1 && args[0] <= 16 && args[1] >= 1 && args[1] <= 6)) {

                    message.channel.send(`Wrong arguments. Try \`${this.name} help\` `).then(botMsg => {
                        message.delete({ timeout: 5000 })
                        botMsg.delete({ timeout: 5000 });
                    });
                    return;
                }

                //get default state
                let state = IO.Read(`./assets/BaseState.json`)
                //check dlcs settings
                let white;
                if (args[2] == "+")
                    white = true;
                else if (args[2] == "-")
                    white = false;
                else if (args[2]) {
                    message.channel.send(`Wrong arguments. Try \`${this.name} help\` `).then(botMsg => {
                        message.delete({ timeout: 5000 })
                        botMsg.delete({ timeout: 5000 });
                    });
                    return;
                }
                //set dlcs
                if (white) {
                    checkDLCs(state, args.slice(3), white);
                    checkCivs(state);
                }
                //check if enough civs 
                if (state.Civs.length < +args[0] * +args[1]) {
                    message.channel.send(`Not enough civs for ${args[0]}x${args[1]} game`).then(botMsg => {
                        message.delete({ timeout: 5000 })
                        botMsg.delete({ timeout: 5000 });
                    });
                    return;
                }
                //send civs
                GeneratePicks(state, message.channel, +args[0], +args[1]);

            },
                err => {
                    logger.log(`error`, `${err}\n${err.stack}`);
                    message.channel.send("Civ role required").then(botMsg => {
                        message.delete({ timeout: 5000 })
                        botMsg.delete({ timeout: 5000 })
                    });
                    return;
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
    const CivList = IO.Read('./assets/CivList.json');
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
    const mergeImg = require('merge-img');
    var CivList = IO.Read('assets/CivList.json');
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
                })
            });

        },
            err => logger.log(`error`, `mergeImg error\n${err}`)
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