//imports 
var fs = require('fs');
var Perm = require('../assets/functions/PermissionsFunctions.js');
var FF = require('../assets/functions/IO.js');
module.exports = {
    name: 'dlc',
    description: 'Whitelist/BlackList DLC (OP)',
    usage: '`!civ dlc [w/b] [DLC names]`',
    execute: async function (message, args) {

        //read GameState
        var CurrState = FF.Read('./commands/CivRandomizer/CurrentState.json');
        //check if Player is OP
        if (!Perm.checkRoles(message, CurrState, true, true, false)) {
            message.reply("ахуел?(Op/Admin only)");
            return;
        }
        //check phase
        if (CurrState.started != "true") {
            message.channel.send("`!start` game first");
            return;
        } else if (CurrState.Phase != "join") {
            message.channel.send("Wrong phase");
            return;

        } else if (CurrState.started == "true" && CurrState.Phase == "join") {

            if (!args[0] || !args[1])
                message.channel.send(`${this.description}\nUsage:\n${this.usage}`);
            let white;
            if (args[0] == "w" || args[0] == "white" || args[0] == "whitelist")
                white = true;
            else if (args[0] == "b" || args[0] == "black" || args[0] == "blacklist")
                white = false;
            args = args.slice(1);
            //-------------------------------------------------------------------------

            for (let i = CurrState.DLCs.length - 1; i >= 0; i--) {
                const dlc = CurrState.DLCs[i];
                let remove = true;
                for (let k = 0; k < args.length; k++) {
                    const A = args[k].toLowerCase();
                    if (dlc.toLowerCase().includes(A) != !white) {
                        remove = false;
                        break;
                    };
                }
                if (remove){
                    DisableDLC(dlc, CurrState);
                    message.channel.send(`${message.author} diabled \`${dlc}\``, {
                        files: [`./commands/CivRandomizer/Imgs/DLC/${dlc}.png`]
                    });
                }
            }
            var CivList = FF.Read('./commands/CivRandomizer/CivList.json');
            for (let i = 0; i < CurrState.Civs.length; i++) {
                const Civ = CurrState.Civs[i];
                if (CurrState.disabledDLC.includes(CivList.find(C => C.id == Civ).DLC))
                    DisableCiv(Civ, CurrState)

            }
            //-------------------------------------------------------------------------
        }



        //write
        fs.writeFile('./commands/CivRandomizer/CurrentState.json', JSON.stringify(CurrState, null, 2), function (err) {
            if (err) {
                console.log(err);
            }
        });
    },
};
//remove civ from pool
function DisableCiv(id, CurrState) {
    CurrState.Civs.splice(CurrState.Civs.findIndex(x => x == id), 1);
    CurrState.disabled.push(id);
}
function DisableDLC(DLC, CurrState) {
    CurrState.DLCs.splice(CurrState.DLCs.findIndex(x => x == DLC), 1);
    CurrState.disabledDLC.push(DLC);
}
