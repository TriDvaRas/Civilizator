var FF = require('../assets/functions/IO.js');
var Phaser = require('../assets/functions/PhasingFunctions.js');
module.exports = {
    name: 'bansSkip',
    description: 'Ends bans phase (OP)',
    usage: '`!civ banSkip`\n`!civ end`',
    execute:async function(message, args) {
        //read GameState
        var CurrState = FF.Read('./commands/CivRandomizer/CurrentState.json');
        //check phase
        if (CurrState.started != "true") {
            message.channel.send("`!start` game first");
            return;
        } else if (CurrState.Phase != "bans") {
            message.channel.send("Wrong phase");
            return;
            //----
        } else if (CurrState.started == "true" && CurrState.Phase == "bans") {
            if (message.author != CurrState.Op) {
                message.reply("Op-only command");
                return;
            }
            //start picks
            
            Phaser.StartPicks(CurrState, message);

        }
    },
};