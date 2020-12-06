
const Embeder = require(`./embeder.js`);
const DB = require(`./db`);
const GC = require(`./guildConfig`);
const Picker = require(`./picker`);
var IO = require('./IO.js');
const getCivList = require(`../functions/civList`)
const logger = require('../logger.js');
const chalk = require('chalk');
const mergeImg = require('merge-img');

module.exports = {
    StartJoins: function StartJoins(state, gameEmbed) {
        gameEmbed.fields.find(field => field.name == "Game Phase").value = "**Joining** \n Click  ✅  to join \n Click  ❎  to leave\n Click  ⏩  to end phase (Operator)\n `dlc` to manage DLCs (Operator)\n `set` to change CPP/BPP (Operator)\n\u200B";
        state.Phase = "join";
        DB.updateGame(state);
    },
    StartBans: function StartBans(state, gameEmbed) {
        gameEmbed.fields.find(field => field.name == "Game Phase").value = "**Bans**\n Click  ➡️  to skip 1 ban  \n Click  ⏩  to end phase (Operator) \n `ban [civId/civName]` to ban civilization\n\u200B";
        gameEmbed.fields.find(field => field.name == "Players").value = state.Players.map(user => user.id).join('\n') + '\u200B';
        gameEmbed.addFields(
            { name: 'Bans', value: '\u200B', inline: true },
            { name: 'Pick', value: '\u200B', inline: true },
            { name: 'Banned civs', value: '\u200B', inline: false }
        );
        gameEmbed.fields.find(field => field.name == "Bans").value = state.Players.map(user => `[${user.bans.length}/${state.banSize}]`).join('\n') + '\u200B';
        gameEmbed.setColor('#de3b09');
        state.Phase = "bans";
        state.bansFull = state.Players.length * state.banSize;
        DB.updateGame(state);
    },
    StartPicks: function StartPicks(state, gameEmbed, channel) {
        try {
            gameEmbed.fields.find(field => field.name == "Game Phase").value = "**Picks** \n Click 🔁 to vote for reroll\n Click 🔁 again to remove vote\n Click 🔢 to pick (for stats)\n\u200B";
            gameEmbed.setColor('#09ded0');
            state.reVotesFull = Math.ceil(state.Players.length * 0.65);
            state.reVotes = 0;
            state.reVoters = [];
            state.Phase = "picks";
            state.Players.forEach(P => {
                P.civs = [];
                P.pick = { Name: "-" };
            });

            let pickField = gameEmbed.fields.find(field => field.name == "Pick")
            if (!pickField)
                gameEmbed.addFields(
                    { name: 'Pick', value: '\u200B', inline: true }
                );

            let reVotesField = gameEmbed.fields.find(field => field.name == "Reroll Votes")
            if (!reVotesField) {

                reVotesField = gameEmbed.addField('Reroll Votes', `[${state.reVotes}/${state.reVotesFull}]\n`, false);
                gameEmbed.addFields(
                    { name: 'Rerolls', value: '0', inline: true }
                );
            }
            else {
                GC.getPickMsgs(channel.guild).then(msgIds => {
                    for (let i = 0; i < msgIds.length; i++) {
                        const element = msgIds[i];
                        let mess = channel.messages.cache.array().find(message => message.id == element)
                        if (mess)
                            removeOld(mess, state.playerSize)
                    }

                },
                    err => logger.log(`error`, `${err}`)
                )
                GC.setPickMsgs(channel.guild, []);
                state.rerolls += 1;
                gameEmbed.fields.find(field => field.name == "Rerolls").value = state.rerolls;
            }


            reVotesField.value = `[${state.reVotes}/${state.reVotesFull}]\n` + state.reVoters.map(user => user.id).join('\n') + '\u200B';
            gameEmbed.fields.find(field => field.name == "Pick").value = state.Players.map(user => user.pick.Name).join('\n') + '\u200B';

            Embeder.set(state, gameEmbed);
            state.picked.forEach(element => {
                state.Civs.push(element);
            });
            state.picked = [];
            GeneratePicks(state, channel);
            DB.updateGame(state);
        } catch (error) {
            logger.log(`error`, `[${chalk.magentaBright(channel.guild.name)}] Error on starting picks ${error.stack}`);

        }

    }
}

//gen and send all picks
function GeneratePicks(state, channel) {
    let indexes = [];
    for (let i = 0; i < state.Players.length; i++)
        indexes.push(i)

    shuffle(indexes);
    indexes.forEach(i => {
        GetCivLine(state, channel, i);
    });



}
//get player civ set
function GetCivLine(state, channel, i) {
    let Player = state.Players[i];
    var CivList = getCivList(state.game)
    let txt = `${Player.id}:\n`;
    images = [];
    for (let j = 0; j < state.playerSize; j++) {
        let Id = GetRandomCivId(state);
        txt += `${CivList[Id - 1].Name}/`;
        images.push(`./assets/${CivList[Id - 1].picPath}`);
        Player.civs.push(CivList[Id - 1]);
    }
    mergeImg(images)
        .then((img) => {
            img.write(`./assets/Imgs/Players/${Player.tag}.png`, () => {
                channel.send(txt.slice(0, -1), {
                    files: [`./assets/Imgs/Players/${Player.tag}.png`]
                }).then(mess => {

                    GC.getPickMsgs(channel.guild).then(msgIds => {
                        msgIds.push(mess.id)
                        GC.setPickMsgs(channel.guild, msgIds);
                    },
                        err => logger.log(`error`, `${err}`)
                    )

                    Picker.add(mess, Player, i + 1);

                })
                    .catch(err => { throw new Error(`send [${channel.guild.name}] [${channel.name}] [${Player.tag}] \n${err}`) })
            });

        },
            err => {
                logger.log(`error`, `mergeImg error\n${err}`)
                channel.send(`${txt.slice(0, -1)} [failed to add images]`).then(mess => {
                    GC.getPickMsgs(channel.guild).then(msgIds => {
                        msgIds.push(mess.id)
                        GC.setPickMsgs(channel.guild, msgIds);
                    },
                        err => logger.log(`error`, `${err}`)
                    )
                    Picker.add(mess, Player, i + 1);
                })
                    .catch(err => { throw new Error(`send [${channel.guild.name}] [${channel.name}] [${Player.tag}] \n${err}`) })
            });
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

function removeOld(mess, max) {
    try {
        if (mess.reactions.cache.some(x => x.emoji.name == [`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`][max - 1]))
            mess.delete().catch(err => { throw new Error(`delete [${mess.guild.name}] [${mess.channel.name}] \n${err}`) })
        else {
            setTimeout(() => removeOld(mess, max), 525);
        }
    } catch (error) {
        logger.log(`error`, `Error in removeOld ${error.stack}`)
    }

}