var FF = require('../assets/functions/IO.js');
var Phaser = require('../assets/functions/PhasingFunctions.js');
var Perm = require('../assets/functions/PermissionsFunctions.js');
module.exports = {
    name: 'start',
    description: 'Starts CivRandomizer Game',
    usage: '`!civ start auto [CivPerPlayer(1-6)] <BansPerPlayer>` - gives civs by User Names' +
        '`!civ start auto+ [CivPerPlayer(1-6)] <BansPerPlayer>` - gives civs by Player Slots',
    execute: async function (message, args) {
        if (args.length > 0) {
            //read state
            var CurrState = FF.Read('./commands/CivRandomizer/CurrentState.json');

            //check civ role
            if (!Perm.checkRoles(message, CurrState, false, false, true)) {
                message.reply("ахуел?(CivRole only)");
                return;
            }
            //check if game is started
            if (CurrState.started == 'true') {
                var reseter = require('./reset.js');
                reseter.execute(message, "auto");
                //reread State
                CurrState = FF.Read('./commands/CivRandomizer/CurrentState.json');
            }
            //start game
            StartGame(message, args, CurrState);
            //write
            FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
            return;
        }
        message.channel.send(`${this.description}\nUsage:\n${this.usage}`);
    },
};
function StartGame(message, args, CurrState) {

    //set game state
    CurrState.Op = `${message.author}`
    if (args[0] == "auto" || args[0] == "auto+" || args[0] == "a" || args[0] == "a+") {
        CurrState.mode = "auto";
        if (args[0] == "auto+" || args[0] == "a+")
            CurrState.autoplus = true;
        else
            CurrState.autoplus = false;
        //check CPP
        if (!args[1] || !parseInt(args[1])) {
            message.channel.send("Wrong arguments");
            message.channel.send(this.usage);
            return;
        }
        if (parseInt(args[1]) < 1)
            args[1] = 1;
        else if (parseInt(args[1]) > 6)
            args[1] = 6;

        CurrState.playerSize = parseInt(args[1]);
        CurrState.started = "true";
        message.channel.send(`Game started. Op - ${message.author}`);
        //Start join phase
        Phaser.StartJoins(CurrState, message);
        //check for bans
        if (args[2] > 0) {
            CurrState.banSize = args[2];
        } else {
            CurrState.banSize = 0;
        }
        return;
    } else {
        message.channel.send(`Wrong arguments`);
    }
}
