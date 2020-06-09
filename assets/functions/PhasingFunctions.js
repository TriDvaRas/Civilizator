module.exports = {
    StartBans: function StartBans(CurrState, message, bSize) {
        message.channel.send(' **- Bans phase -** \n`!civ ban [civId/civAlias/skip]` to ban\n`!civ opban [civId/civAlias]` for extra bans (OP)\n`!civ bansSkip` to finish bans phase (OP)\n`!civ list` for civs list');
        CurrState.Phase = "bans";
    },
    StartPicks: function StartPicks(CurrState, message) {
        CurrState.Phase = "picks";
        message.channel.send(" **- Pick phase -** ");
        GeneratePicks(CurrState, message);
    },
    StartJoins: function StartJoins(CurrState, message) {//`!civ joinSkip <PlayerCount>` to skip phase(Op-only)\n
        message.channel.send(' **- Join phase -** \n`!civ join` to join game\n`!civ add [UserMention(s)]` to add player(s) (OP)\n`!civ joinEnd` to end phase (OP)\n`!civ dlc [w/b] [DLC names]` to whitelist/blacklist dlcs');
        CurrState.Phase = "join";
    }
}
//IO system
var FF = require('./FileFunctions.js');
//gen and send all picks
function GeneratePicks(CurrState, message) {
    shuffle(CurrState.Players, CurrState.PlayersId);
    for (let i = 0; i < CurrState.PlayersId.length; i++) {

        GetCivLine(CurrState, message, i);

    }
}
//get player civ set
function GetCivLine(CurrState, message, i) {
    let Player = CurrState.Players[i];
    let PlayerId = CurrState.PlayersId[i];
    const mergeImg = require('merge-img');
    var CivList = FF.Read('./commands/CivRandomizer/CivList.json');
    let txt;
    if (CurrState.autoplus)
        txt = `Player ${i + 1}:\n`;
    else
        txt = `${PlayerId}:\n`;
    images = [];
    for (let i = 0; i < CurrState.playerSize; i++) {
        Id = GetRandomCivId(CurrState);
        txt += `${CivList[Id - 1].Name}/`;
        images.push(`./commands/CivRandomizer/${CivList[Id - 1].picPath}`);
    }
    mergeImg(images)
        .then((img) => {
            img.write(`./commands/CivRandomizer/Imgs/Players/${Player}.png`, () => {
                message.channel.send(txt.slice(0, -1), {
                    files: [`./commands/CivRandomizer/Imgs/Players/${Player}.png`]
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
function shuffle(Players, PlayerIds) {
    for (let i = Players.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [Players[i], Players[j]] = [Players[j], Players[i]];
        [PlayerIds[i], PlayerIds[j]] = [PlayerIds[j], PlayerIds[i]];
    }
}