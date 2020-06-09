//imports 
var Perm = require('./assets/functions/PermissionsFunctions.js');
var FF = require('./assets/functions/FileFunctions.js');
var BanF = require('./assets/functions/BansFunctions.js');
module.exports = {
    name: 'opban',
    description: 'Bans Civilization by id or alias ignoring bans limit (OP)',
    usage: '`!civ opban [Id/Alias]`',
    execute: async function (message, args) {
        //read GameState
        var CurrState = FF.Read('./commands/CivRandomizer/CurrentState.json');
        //check phase
        if (CurrState.started != "true") {
            message.channel.send("`!start` game first");
            return;
        } else if (CurrState.Phase != "bans") {
            message.channel.send("Wrong phase");
            return;

        } else if (CurrState.started == "true" && CurrState.Phase == "bans") {
            //check if Player is OP
            if (!Perm.checkRoles(message, CurrState, true, true, false)) {
                message.reply("ахуел?(Op/Admin only)");
                return;
            }

            for (let j = 0; j < args.length; j++) {
                let arg = args[j];
                //read list
                var CivList = FF.Read('./commands/CivRandomizer/CivList.json');

                //find civ by id
                C = CivList.find(x => x.id == arg);


                // if not found by id
                if (!C) {
                    C = [];
                    //find all aliases
                    CivList.forEach(civ => {

                        if (BanF.includesIgnoreCase(civ.Alias, arg)) {
                            C.push(civ);
                        }
                    });
                    //check if multiple
                    if (C.length > 1) {
                        let txt = `Multiple aliases for \`${arg}\`:`;
                        C.forEach(civ => {
                            txt += `\n${civ.id}. ${civ.Alias.join(` - `)}`
                        });
                        message.channel.send(txt);
                        return;
                    }
                    else if (C.length == 0) {
                        let txt = `No aliases found for \`${arg}\`:`;
                        message.channel.send(txt);
                        return;

                    }
                    if (C.length == 1) {
                        C = C[0];
                    }
                }


                //if found 
                if (C) {
                    //check not if banned
                    if (!BanF.CheckBanned(CurrState, C)) {
                        BanF.opBan(C, CurrState);

                        message.channel.send(`${message.author} opbanned ${C.Name} (${C.id})`, {
                            files: [`./commands/CivRandomizer/${C.picPath}`]
                        });
                        FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
                    } else {
                        message.send(`${message.author} ${C.Name} (${C.id}) is already banned `, {
                            files: [`./commands/CivRandomizer/${C.picPath}`]
                        });
                    }
                }
            }
            //-------------------------------------------------------------------------

        }
        //write
        FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
    },
};