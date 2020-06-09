var FF = require('../assets/functions/IO.js');
var Perm = require('../assets/functions/PermissionsFunctions.js');
module.exports = {
    name: 'add',
    description: 'Adds users to current game (OP)',
    usage: '`!civ add [UserMentions]`',
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
        if (!Perm.checkRoles(message, CurrState, true, true, false)) {
            message.reply("ахуел?");
            return;
        }
        //check if already joined 
        message.mentions.users.array().forEach(User => {
            
            if (!CheckCanJoin(message, User, CurrState)) {
                //message.reply("you already joined");
            } else
                //Join
                Join(message, User, CurrState);
        });

        //write State
        FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
    },
};

function CheckCanJoin(message, user, CurrState) {
    for (let i = 0; i < CurrState.PlayersId.length; i++) {

        
        if (CurrState.PlayersId[i] == `${user}`){
            message.channel.send(`${user} is already added`);
            return false;
        }

    }
    return true;
}
function Join(message, user, CurrState) {
    CurrState.PlayersId.push(`${user}`);
    CurrState.Players.push(user.tag);
    CurrState.gameSize = parseInt(CurrState.gameSize) + 1;
    message.channel.send(`${message.author} added ${user}`);
}