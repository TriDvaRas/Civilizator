var FF = require('../assets/functions/IO.js');
var BanF = require('../assets/functions/BansFunctions.js');
module.exports = {
    name: 'ban',
    description: 'Bans Civilization by id or alias',
    usage: '`!civ ban [Id/Alias/skip]`',
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
            //lowercase args
            args.forEach(x => {
                x = x.toLowerCase();
            });
            //check if Player can ban
            if (!BanF.CheckCanBan(CurrState, message)) {
                message.reply("Out of bans");
                return;
            }
            //check if skip
            if (args[0] == "skip") {
                for (let i = 0; i < CurrState.banSize; i++) {
                    CurrState.Banners.push(`${message.author}`);
                    CurrState.bansActual = parseInt(CurrState.bansActual) + 1;
                }
                message.channel.send(message.author + " skipped bans");
                FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
                BanF.CheckBansEnd(CurrState, message);
                return;
            }
            for (let j = 0; j < args.length && BanF.CheckCanBan(CurrState, message); j++) {
                let arg = args[j];
                //read list
                var CivList = FF.Read('./commands/CivRandomizer/CivList.json');

                //find civ by id
                C = CivList.find(civ => civ.id == arg);



                // if not found by id
                if (!C) {
                    C = [];
                    //find all aliases
                    CivList.forEach(civ => {
                        if (BanF.includesIgnoreCase(civ.Alias, arg))
                            C.push(civ);
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
                    if (C.length == 1)
                        C = C[0];

                }
                console.log(C);


                //if found 
                if (C) {
                    //check if banned
                    if (!BanF.CheckBanned(CurrState, C)) {
                        BanF.Ban(C, CurrState);
                        CurrState.Banners.push(`${message.author}`);
                        message.channel.send(`${message.author} banned ${C.Name} (${C.id})\nBans: ${CurrState.bansActual}/${CurrState.bansFull}`, {
                            files: [`./commands/CivRandomizer/${C.picPath}`]
                        });
                        FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
                        sleep(200).then(() => {
                            BanF.CheckBansEnd(CurrState, message);
                        });
                        sleep(200).then(() => {
                            FF.Write('./commands/CivRandomizer/CurrentState.json', CurrState);
                        });
                    } else {
                        message.reply(`${C.Name} (${C.id}) is already banned `, {
                            files: [`./commands/CivRandomizer/${C.picPath}`]
                        });
                    }
                }
            }

        }

    },
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}