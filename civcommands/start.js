
const Phaser = require('../functions/Phaser.js');
const Perm = require('../functions/Permissions.js');
const GC = require(`../functions/guildConfig.js`);
const Reacter = require(`../functions/reactions.js`);
const Embeder = require("../functions/embeder.js");
const logger = require("../logger");
const chalk = require('chalk');
const DB = require(`../functions/db`);
const Discord = require(`discord.js`);
const db = require('../functions/db.js');

module.exports = {
    name: 'start',
    description: 'Starts Civilizator Game',
    usage: '`start [game] <CivPerPlayer(1-6)> [BansPerPlayer(0-4)]`\n [game] is optional argument to choose the game you play (available: civ5, lek, civ6)',
    example: `\`start 3\` - civ5, 3 civs for each player, no bans
\`start civ6 4 1\` - civ6, 4 civs and 1 ban for each player
\`start lek 3 2\` - civ5 + lek mod, 3 civs and 2 bans for each player`,
    execute: function (message, args) {
        if (args.length == 0)
            //send help on 0 args
            return message.channel.send(`Wrong arguments. Try \`${this.name} help\` `)
                .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })

        //read state
        GC.getGameState(message.guild).then(state => {

            //check civ role
            Perm.checkRoles(message.member, state.Op, { civ: true })
                .then(() => {
                    //check game
                    let game;
                    if (gameNames.includes(args[0].toLowerCase())) {
                        game = args.shift();
                    }
                    else
                        game = "Civ5";
                    //check cd
                    CheckLastGame(message, state).then(function () {
                        GC.resetGameState(message.guild, game).then(function (state) {
                            return preStart(message, args, state);
                        },
                            err => logger.log(`error`, err)
                        );
                    }, () => { })
                },
                    () => {
                        message.channel.send("CivRole only").catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                    })
        });



    },
};
function preStart(message, args, state) {
    db.addGameCount(message.guild)
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
    ).then(mess => {
        DB.newGame(state, message.author.username, message.guild.name).then(id => {
            state.gameId = id;
            state.guildId = message.guild.id;
            state.startTime = Date.now();
            //create embed
            gameEmbed = Embeder.create();
            //start game
            if (StartGame(message, args, state, gameEmbed))
                return;

            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] new ${state.game} game started CPP-${state.playerSize} BPP-${state.banSize}`);
            mess.edit(gameEmbed).then(msg => {
                logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] embed created`);
                state.embedId = msg.id;
                GC.setGameState(message.guild, state);
                Reacter.addJoiner(msg);
            });
        },
            error => {
                logger.log(`warn`, `[${chalk.magentaBright(message.guild.name)}] Civilizator machine broke...\n${error}`)
                mess.edit(new Discord.MessageEmbed()
                    .setColor('#46a832')
                    .setTitle("**Civilization V Game**")
                    .setDescription("**[Civilization List](https://docs.google.com/spreadsheets/d/e/2PACX-1vR5u67tm62bbcc5ayIByMOeiArV7HgYvrhHYoS2f84m0u4quPep5lHv9ghQZ0lNvArDogYdhuu1_f9b/pubhtml?gid=0&single=true)**")
                    .setThumbnail('https://tdr.s-ul.eu/Cz9IF5oS')
                    .addFields(
                        { name: `Civilizator machine broke...\nTry starting a new game\nIf this doesn't help please submit a bug report in bot's Discord server https://discord.gg/nFMFs2e or to Bot's DM`, value: '\u200B', inline: true }
                    )
                    .setTimestamp()
                    .setFooter('Created by TriDvaRas', 'https://tdr.s-ul.eu/hP8HuUCR')
                )
            })
    }).catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
}
function StartGame(message, args, state, gameEmbed) {

    //set game state
    state.Op = `${message.author}`
    gameEmbed.fields.find(field => field.name == "Game Operator").value = message.author;
    //check CPP
    if (!args[0] || !parseInt(args[0])) {
        message.channel.send("Wrong arguments").then(msg => {
            msg.delete({ timeout: 5000 }).catch(err => {throw new Error( `delete [${message.guild.name}] [${message.channel.name}]  \n${err}`)});
        }).catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
        return true;
    }
    if (parseInt(args[0]) < 1)
        args[0] = 1;
    else if (parseInt(args[0]) > 6)
        args[0] = 6;

    gameEmbed.fields.find(field => field.name == "Civs per player").value = parseInt(args[0]);
    gameEmbed.fields.find(field => field.name == "Game Id").value = parseInt(state.gameId);
    gameEmbed.fields.find(field => field.name == "Game").value = state.game;
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

function CheckLastGame(message, state) {
    return new Promise((resolve, reject) => {
        Perm.checkRoles(message.member)
            .then(
                () => {
                    resolve();
                },
                () => {
                    let ms = Date.now() - state.startTime;
                    let m = ms / 60000;

                    if (m < 1) {
                        message.channel.send(`Wait at least 5 minutes (1 for last game's op) before starting a new game`)
                            .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                        reject();
                    } else if (m < 5) {
                        Perm.checkRoles(message.member, state.Op, { admin: true, op: true })
                            .then(
                                () => {
                                    resolve();
                                },
                                () => {
                                    message.channel.send(`Wait at least 5 minutes (1 for last game's op) before starting a new game`)
                                        .catch(err => { throw new Error(`send [${message.guild.name}] [${message.channel.name}] [${message.author.tag}] \n${err}`) })
                                    reject();
                                })
                    } else {
                        resolve();
                    }
                })
    });
}