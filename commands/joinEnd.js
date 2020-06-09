var FF = require('./assets/functions/FileFunctions.js');
var Phaser = require('./assets/functions/PhasingFunctions.js');
var Perm = require('./assets/functions/PermissionsFunctions.js');
module.exports = {
    name: 'joinEnd',
    description: 'Ends join phase (OP)',
    usage: '`!civ joinEnd`\n`!civ end`',
    execute:async function(message, args) {
        //read GameState
        var CurrState = FF.Read('./commands/CivRandomizer/CurrentState.json');
        //check phase
        if (CurrState.started != "true") {
            message.channel.send("`!start` game first");
            return;
        } else if (CurrState.Phase != "join") {
            message.channel.send("Wrong phase");
            return;
            //----
        } else if (CurrState.started == "true" && CurrState.Phase == "join") {
            //check roles
            if (!Perm.checkRoles(message, CurrState, true, true, false)) {
                message.reply("ахуел?(Op/Admin only)");
                return;
            }
            //send PlayerList
            text = `Join closed by ${message.author}\nJoined Players:`;
            for (let i = 0; i < CurrState.Players.length; i++) {
                text += `\n${CurrState.Players[i]}`;

            }
            message.channel.send(text);
            //start bans
            if (CurrState.banSize > 0) {
                CurrState.bansFull=parseInt(CurrState.gameSize)*parseInt(CurrState.banSize);
                CurrState.reVotesFull=Math.ceil(CurrState.bansFull*0.6);
                Phaser.StartBans(CurrState, message, CurrState.banSize);
            }//start picks
            else {
                Phaser.StartPicks(CurrState, message)
            }

        }
        FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
    },
};