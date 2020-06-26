
const Embeder = require(`./embeder.js`);
const sheet = require(`./sheet`);
const GC = require(`./guildConfig`);
module.exports = {
    StartJoins: function StartJoins(CurrState, gameEmbed) {
        gameEmbed.fields.find(field => field.name == "Game Phase").value = "**Joining** \n Click  ✅  to join \n Click  ❎  to leave\n Click  ⏩  to end phase (Operator)\n `dlc` to manage DLCs (Operator)\n\u200B";
        CurrState.Phase = "join";
        sheet.updateGame(CurrState);
    },
    StartBans: function StartBans(CurrState, gameEmbed) {
        gameEmbed.fields.find(field => field.name == "Game Phase").value = "**Bans**\n Click  ➡️  to skip 1 ban  \n Click  ⏩  to end phase (Operator) \n `ban [civId/civName]` to ban civilization\n\u200B";
        gameEmbed.fields.find(field => field.name == "Players").value = CurrState.Players.map(user => user.id).join('\n') + '\u200B';
        gameEmbed.addFields(
            { name: 'Bans', value: '\u200B', inline: true },
            { name: 'Banned civs', value: '\u200B', inline: false }
        );
        gameEmbed.fields.find(field => field.name == "Bans").value = CurrState.Players.map(user => `[${user.bans.length}/${CurrState.banSize}]`).join('\n') + '\u200B';
        gameEmbed.setColor('#de3b09');
        CurrState.Phase = "bans";
        CurrState.bansFull = CurrState.Players.length * CurrState.banSize;
        sheet.updateGame(CurrState);
    },
    StartPicks: function StartPicks(state, gameEmbed, channel) {
        gameEmbed.fields.find(field => field.name == "Game Phase").value = "**Picks** \n Click 🔁 to vote for reroll\n\u200B";
        gameEmbed.setColor('#09ded0');
        state.reVotesFull = Math.ceil(state.Players.length * 0.65);
        state.reVotes = 0;
        state.reVoters = [];
        state.Phase = "picks";
        state.Players.forEach(P => {
            P.civs = [];
            P.pick = "-";
            if (P.civsMessage != "")
                channel.messages.cache.array().find(x => x.id == P.civsMessage).delete();
        });



        let reVotesField = gameEmbed.fields.find(field => field.name == "Reroll Votes")
        if (!reVotesField) {
            reVotesField = gameEmbed.addField('Reroll Votes', '\u200B', false);
            gameEmbed.addField('Rerolls', '0', false);
        }
        else {
            let msgIds = GC.getPickMsgs(channel.guild);
            for (let i = 0; i < msgIds.length; i++) {
                const element = msgIds[i];
                let mess = channel.messages.cache.array().find(x => x.id == element)
                if (mess)
                    mess.delete();
            }
            GC.setPickMsgs(channel.guild, []);
            gameEmbed.fields.find(field => field.name == "Rerolls").value = +gameEmbed.fields.find(field => field.name == "Rerolls").value + 1;
            state.rerolls = +gameEmbed.fields.find(field => field.name == "Rerolls").value;
        }


        reVotesField.value = `[${state.reVotes}/${state.reVotesFull}]\n` + state.reVoters.map(user => user.id).join('\n') + '\u200B';

        Embeder.set(state, channel, gameEmbed);
        GeneratePicks(state, channel);
        sheet.updateGame(state);
    }
}
//IO system
var IO = require('./IO.js');
//gen and send all picks
function GeneratePicks(CurrState, channel) {
    shuffle(CurrState.Players);
    for (let i = 0; i < CurrState.Players.length; i++) {

        GetCivLine(CurrState, channel, i);

    }
}
//get player civ set
function GetCivLine(state, channel, i) {
    let Player = state.Players[i];
    const mergeImg = require('merge-img');
    var CivList = IO.Read('assets/CivList.json');
    let txt = `${Player.id}:\n`;
    images = [];
    for (let i = 0; i < state.playerSize; i++) {
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
                }).then(msg => {
                    let msgIds = GC.getPickMsgs(channel.guild);
                    msgIds.push(msg.id)
                    GC.setPickMsgs(channel.guild, msgIds);
                })
            });

        });
    if (state.repeat == true)
        for (let i = state.picked.length - 1; i >= 0; i--) {
            state.Civs.push(state.picked.splice(i, 1)[0]);
        }
    return;
}
//civ id from pool
function GetRandomCivId(CurrState) {//Pool, RemoveFromPool
    i = getRandomInt(0, CurrState.Civs.length - 1);
    n = CurrState.Civs[i];
    CurrState.picked.push(CurrState.Civs.splice(i, 1)[0]);
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