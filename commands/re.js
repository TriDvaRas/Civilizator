var FF = require('./assets/functions/FileFunctions.js');
var Phaser = require('./assets/functions/PhasingFunctions.js');
var Perm = require('./assets/functions/PermissionsFunctions.js');
module.exports = {
    name: 're',
    description: 'Votes for rerolling civs',
    usage: '`!civ re`',
    execute:async function(message, args) {
        //read GameState
        var CurrState = FF.Read('./commands/CivRandomizer/CurrentState.json');
        //check phase
        if (CurrState.started != "true") {
            message.channel.send("`!start` game first");
            return;
        } else if (CurrState.Phase != "picks") {
            message.channel.send("Wrong phase");
            return;
            //----
        } else if (CurrState.started == "true" && CurrState.Phase == "picks") {
            //check roles
            if (!Perm.checkRoles(message, CurrState, false, false, true)) {
                message.reply("ахуел?(CivRole only)");
                return;
            }
            //check if player
            if (!(CurrState.PlayersId.includes(`${message.author}`))) {
                message.reply("а ты кто(who)?(not in player list)");
                return;
            }
            votesN = parseInt(CurrState.reVotes)+1;
            CurrState.reVotes=votesN;
            votesF = parseInt(CurrState.reVotesFull);
            CurrState.reVoters.push(`${message.author}`);
            message.channel.send(`${message.author} voted for reroll (\`!civ re\`) \n Votes: (${votesN}/${votesF})`);

            //start picks
            if (votesN >= votesF) {
                message.channel.send(`Rerolling`);
                CurrState.reVotes=0;
                votesN = 0;
                CurrState.reVoters = [];
                for (let i = CurrState.picked.length - 1; i >= 0; i--) {
                    CurrState.Civs.push(CurrState.picked.splice(i, 1)[0]);

                }
                Phaser.StartPicks(CurrState, message);

            }
            sleep(200).then(() => {
                FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
            });
        }
    },
};
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}