var FF = require('./assets/functions/FileFunctions.js');
var Perm = require('./assets/functions/PermissionsFunctions.js');
module.exports = {
    name: 'join',
    description: 'Adds you to CivRandomizer game',
    usage: '`!civ join`',
    execute:async function(message, args) {
        //read GameState
        var CurrState = FF.Read('./commands/CivRandomizer/CurrentState.json');
        //Check gameState
        if (CurrState.started != "true") {
            message.channel.send("`!start` game first");
            return;
        } else if (CurrState.Phase != "join") {
            message.channel.send("Wrong phase");
            return;
        }
        //check permissions
        if (!Perm.checkRoles(message, CurrState, false, false, true)) {
            message.reply("ахуел?(CivRole only)");
            return;
        }
        //check if already joined 
        if (!CheckCanJoin(message, CurrState)) {
            message.reply("you already joined");
            return;
        }
        //Join
        Join(message, CurrState);
        //write State
        FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
    },
};

function CheckCanJoin(message, CurrState) {
    for (let i = 0; i < CurrState.Players.length; i++) {
        if (CurrState.Players[i] == message.author.tag) {
            return false;
        }
    }
    return true;
}
function Join(message, CurrState) {
    CurrState.PlayersId.push(`${message.author}`);
    CurrState.Players.push(message.author.tag);
    CurrState.gameSize = parseInt(CurrState.gameSize) + 1;
    message.channel.send(`${message.author} joined`);
}