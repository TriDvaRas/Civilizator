
const Phaser = require('../assets/functions/Phaser.js');
const Perm = require('../assets/functions/Permissions.js');
const GC = require(`../assets/functions/guildConfig.js`);
const Reacter = require(`../assets/functions/reactions.js`);
const Embeder = require("../assets/functions/embeder.js");
module.exports = {
    name: 'start',
    description: 'Starts Civilizator Game',
    usage: '`start [CivPerPlayer(1-6)] <BansPerPlayer(0-4)>`',
    execute: async function (message, args) {
        if (args.length > 0) {
            //read state
            var CurrState = GC.getGameState(message.guild);

            //check civ role
            if (!Perm.checkRoles(message.member, CurrState.Op, { civ: true })) {
                message.reply("CivRole only");
                return;
            }
            //check if game is started
            if (CurrState.started == true) {
                Perm.checkRoles(message.member, CurrState.Op, { op: true });
                GC.resetGameState(message.guild);
                //reread State
                CurrState = GC.getGameState(message.guild);
            }
            //create embed
            gameEmbed = Embeder.create();
            //start game
            if (StartGame(message, args, CurrState, gameEmbed))
                return;
            message.channel.send(gameEmbed).then(msg => {
                CurrState.embedId = msg.id;
                GC.setGameState(message.guild, CurrState);
                Reacter.addJoiner(msg);
            });
            return;
        }
        //send help on 0 args
        message.channel.send(`${this.description}\nUsage:\n${this.usage}`);
    },
};
function StartGame(message, args, CurrState, gameEmbed) {

    //set game state
    CurrState.Op = `${message.author}`
    gameEmbed.fields.find(field => field.name == "Game Operator").value = message.author;
    //check CPP
    if (!args[0] || !parseInt(args[0])) {
        message.channel.send("Wrong arguments").then(msg=>{
            msg.delete({timeout:5000});
        });
        return true;
    }
    if (parseInt(args[0]) < 1)
        args[0] = 1;
    else if (parseInt(args[0]) > 6)
        args[0] = 6;

    gameEmbed.fields.find(field => field.name == "Picks per player").value = parseInt(args[0]);
    CurrState.playerSize = parseInt(args[0]);
    CurrState.started = true;
    //Start join phase
    Phaser.StartJoins(CurrState, gameEmbed);
    //check for bans
    args[1] = parseInt(args[1]);
    if (!args[1] || args[1] < 0)
        args[1] = 0;
    if (args[1] > 4)
        args[1] = 4;

    gameEmbed.fields.find(field => field.name == "Bans per player").value = args[1];
    CurrState.banSize = args[1];
    return;

}