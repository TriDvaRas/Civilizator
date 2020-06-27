
const Phaser = require('../assets/functions/Phaser.js');
const Perm = require('../assets/functions/Permissions.js');
const GC = require(`../assets/functions/guildConfig.js`);
const Reacter = require(`../assets/functions/reactions.js`);
const Embeder = require("../assets/functions/embeder.js");
const logger = require("../logger");
const chalk = require('chalk');
const sheet = require(`../assets/functions/sheet`);
const Discord=require(`discord.js`)

module.exports = {
    name: 'start',
    description: 'Starts Civilizator Game',
    usage: '`start <CivPerPlayer(1-6)> [BansPerPlayer(0-4)]`',
    execute: function (message, args) {
        if (args.length > 0) {
            //read state
            var state = GC.getGameState(message.guild);

            //check civ role
            if (!Perm.checkRoles(message.member, state.Op, { civ: true })) {
                message.reply("CivRole only");
                return;
            }
            //check if game is started
            if (state.started == true) {
                Perm.checkRoles(message.member, state.Op, { op: true });
                GC.resetGameState(message.guild);
                //reread State
                state = GC.getGameState(message.guild);
            }
            message.channel.send(new Discord.MessageEmbed()
                .setColor('#46a832')
                .setTitle("**Civilization V Game**")
                .setDescription("**[Civilization List](https://docs.google.com/spreadsheets/d/e/2PACX-1vR5u67tm62bbcc5ayIByMOeiArV7HgYvrhHYoS2f84m0u4quPep5lHv9ghQZ0lNvArDogYdhuu1_f9b/pubhtml?gid=0&single=true)**")
                .setThumbnail('https://tdr.s-ul.eu/Cz9IF5oS')
                .addFields(
                    { name: 'Creating game...', value: '\u200B', inline: true }
                )
                .setTimestamp()
                .setFooter('Created by TriDvaRas', 'https://tdr.s-ul.eu/hP8HuUCR')
            ).then(mess=>{
                sheet.newGame(state, mess.author.username, mess.guild.name).then(id => {
                    state.gameId = id;
                    //create embed
                    gameEmbed = Embeder.create();
                    //start game
                    if (StartGame(message, args, state, gameEmbed))
                        return;
    
                    logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] new game started CPP-${state.playerSize} BPP-${state.banSize}`);
                    mess.edit(gameEmbed).then(msg => {
                        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] embed created`);
                        state.embedId = msg.id;
                        GC.setGameState(message.guild, state);
                        Reacter.addJoiner(msg);
                    });
                });
            })
            

            return;
        }
        //send help on 0 args
        message.channel.send(`${this.description}\nUsage:\n${this.usage}`);
    },
};
function StartGame(message, args, state, gameEmbed) {

    //set game state
    state.Op = `${message.author}`
    gameEmbed.fields.find(field => field.name == "Game Operator").value = message.author;
    //check CPP
    if (!args[0] || !parseInt(args[0])) {
        message.channel.send("Wrong arguments").then(msg => {
            msg.delete({ timeout: 5000 });
        });
        return true;
    }
    if (parseInt(args[0]) < 1)
        args[0] = 1;
    else if (parseInt(args[0]) > 6)
        args[0] = 6;

    gameEmbed.fields.find(field => field.name == "Civs per player").value = parseInt(args[0]);
    gameEmbed.fields.find(field => field.name == "Game Id").value = parseInt(state.gameId);
    state.playerSize = parseInt(args[0]);
    state.started = true;
    //Start join phase
    Phaser.StartJoins(state, gameEmbed);
    //check for bans
    args[1] = parseInt(args[1]);
    if (!args[1] || args[1] < 0)
        args[1] = 0;
    if (args[1] > 4)
        args[1] = 4;

    gameEmbed.fields.find(field => field.name == "Bans per player").value = args[1];
    state.banSize = args[1];
    return;

}