
const Embeder = require(`./embeder.js`);
module.exports = {
    StartJoins: function StartJoins(CurrState, gameEmbed) {
        gameEmbed.fields.find(field => field.name == "Game Phase").value = "**Joining** \n Click  ✅  to join \n Click  ❎  to leave\n Click  ⏩  to end phase (Operator)\n\u200B";
        CurrState.Phase = "join";
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
    },
    StartPicks: function StartPicks(CurrState, gameEmbed, channel) {
        gameEmbed.fields.find(field => field.name == "Game Phase").value = "**Picks** \n ПОШЕЛ НАХУЙ\n\u200B";
        gameEmbed.setColor('#09ded0');
        CurrState.reVotesFull = Math.ceil(CurrState.Players.length * 0.65);
        CurrState.reVotes = 0;
        CurrState.reVoters = [];
        CurrState.Phase = "picks";
        let reVotesField = gameEmbed.fields.find(field => field.name == "Reroll Votes")
        if (!reVotesField)
            reVotesField = gameEmbed.addField('Reroll Votes', '\u200B', false);
        
            
        reVotesField.value = `[${CurrState.reVotes}/${CurrState.reVotesFull}\n]` + CurrState.reVoters.map(user => user.id).join('\n') + '\u200B';

        Embeder.set(CurrState, channel, gameEmbed);
        GeneratePicks(CurrState, channel);
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
function GetCivLine(CurrState, channel, i) {
    let Player = CurrState.Players[i].tag;
    let PlayerId = CurrState.Players[i].id;
    const mergeImg = require('merge-img');
    var CivList = IO.Read('assets/CivList.json');
    let txt = `${PlayerId}:\n`;
    images = [];
    for (let i = 0; i < CurrState.playerSize; i++) {
        let Id = GetRandomCivId(CurrState);
        txt += `${CivList[Id - 1].Name}/`;
        images.push(`./assets/${CivList[Id - 1].picPath}`);
    }
    mergeImg(images)
        .then((img) => {
            img.write(`./assets/Imgs/Players/${Player}.png`, () => {
                channel.send(txt.slice(0, -1), {
                    files: [`./assets/Imgs/Players/${Player}.png`]
                });
            });

        });
    if (CurrState.repeat == true)
        for (let i = CurrState.picked.length - 1; i >= 0; i--) {
            CurrState.Civs.push(CurrState.picked.splice(i, 1)[0]);
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