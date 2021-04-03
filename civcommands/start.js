/*global gameNamesLower, gameNames, logger, chalk, gameLogos,activeGames*/
const Phaser = require('../functions/Phaser.js');
const Perm = require('../functions/Permissions.js');
const Reacter = require(`../functions/reactions.js`);
const Embeder = require("../functions/embeder.js");
const db = require(`../functions/db`);
const Discord = require(`discord.js`);

module.exports = {
    name: 'start',
    description: 'Starts Civilizator Game',
    usage: '`start [game] <CivPerPlayer(1-6)> [BansPerPlayer(0-4)]`\n [game] is optional argument to choose the game you play (available: civ5, lek, civ6)',
    example: `\`start 3\` - civ5, 3 civs for each player, no bans
\`start civ6 4 1\` - civ6, 4 civs and 1 ban for each player
\`start lek 3 2\` - civ5 + lek mod, 3 civs and 2 bans for each player`,
    execute: function execute(message, args, guildConfig) {
        if (args.length == 0)
            //send help on 0 args
            return message.channel.send(`Wrong arguments. Try \`${this.name} help\` `)
        //read state
        db.getStateByGuild(message.guild)
            .then(state => {
                if (Perm.checkRoles(guildConfig, message.member, null, { civ: true }))
                    checkLastGame(message, state, guildConfig)
                        .then(
                            () => startGame(message, args),
                            () => { }
                        )
                else
                    message.channel.send("CivRole only")
            })
    },
};
function startGame(message, args) {
    //check if game specified 
    const options = parceArgs(message, args)
    if (!options) return

    sendPlaceholder(message.channel).then(PH => {
        db.newGame(message.guild, message.author, PH, options).then(
            state => {
                //create embed
                let gameEmbed = Embeder.create();
                state.setEmbed(PH, gameEmbed)

                gameEmbed.setThumbnail(gameLogos[state.gameName])
                gameEmbed.updateField("Game Operator", message.author)
                gameEmbed.updateField("Civs per player", options.cpp)
                gameEmbed.updateField("Bans per player", options.bpp)
                gameEmbed.updateField("Game Id", state.gameId)
                gameEmbed.updateField("Game", state.gameName)
                //Start join phase
                Phaser.startJoins(state, gameEmbed);//TODO
                logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] new ${state.gameName} game started CPP-${state.cpp} BPP-${state.bpp}`);
                PH.edit(gameEmbed).then(msg => {
                    logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] embed posted`)
                    state.setEmbed(PH, gameEmbed)
                    Reacter.addJoiner(msg, { gameId: state.gameId, ...activeGames.get(state.gameId) })
                });
            },
            error => { setGameEmbeedToBroken(PH, error) })
    })
}

function parceArgs(message, args) {
    //game
    let game = "Civ5";
    let index = gameNamesLower.indexOf(args[0].toLowerCase())
    if (index > -1) {
        game = gameNames[index]
        args.shift()
    }

    //CPP
    if (!args[0] || !parseInt(args[0])) {
        message.channel.send(`Wrong arguments. Try \`${module.exports.name} help\` `).then(msg => msg.delete({ timeout: 5000 }))
        return false
    }
    if (parseInt(args[0]) < 1)
        args[0] = 1;
    else if (parseInt(args[0]) > 6)
        args[0] = 6;
    //BPP
    args[1] = parseInt(args[1]);
    if (!args[1] || args[1] < 0)
        args[1] = 0;
    if (args[1] > 4)
        args[1] = 4;

    return {
        cpp: args[0],
        bpp: args[1],
        game
    }
}

function sendPlaceholder(channel) {
    return channel.send(new Discord.MessageEmbed()
        .setColor('#46a832')
        .setTitle("**Civilizator Game**")
        .setDescription("**[Civilizations List](https://docs.google.com/spreadsheets/d/e/2PACX-1vR5u67tm62bbcc5ayIByMOeiArV7HgYvrhHYoS2f84m0u4quPep5lHv9ghQZ0lNvArDogYdhuu1_f9b/pubhtml?gid=0&single=true)**")
        .addFields(
            { name: 'Starting game...', value: '\u200B', inline: true }
        )
        .setFooter('Created by TriDvaRas#4805', 'https://tdr.s-ul.eu/hP8HuUCR')
    )
}

function setGameEmbeedToBroken(message, error) {
    logger.log(`warn`, `[${chalk.magentaBright(message.guild.name)}] Civilizator machine broke...\n${error}`)
    return message.edit(new Discord.MessageEmbed()
        .setColor('#46a832')
        .setTitle("**Civilizator Game**")
        .setDescription("**[Civilizations List](https://docs.google.com/spreadsheets/d/e/2PACX-1vR5u67tm62bbcc5ayIByMOeiArV7HgYvrhHYoS2f84m0u4quPep5lHv9ghQZ0lNvArDogYdhuu1_f9b/pubhtml?gid=0&single=true)**")
        .setThumbnail('https://tdr.s-ul.eu/Cz9IF5oS')
        .addFields(
            { name: `Civilizator machine broke...\nTry starting a new game\nIf this doesn't help please submit a bug report in bot's Discord server https://discord.gg/nFMFs2e or in Bot's DM`, value: '\u200B', inline: true }
        )
        .setFooter('Created by TriDvaRas#4805', 'https://tdr.s-ul.eu/hP8HuUCR')
    )
}


function checkLastGame(message, state, gConfig) {
    return new Promise((resolve, reject) => {
        if (Perm.checkRoles(gConfig, message.member))
            resolve()
        else
            db.getLastGameTime(message.guild.id).then(startTime => {
                let ms = Date.now() - startTime;
                let m = ms / 60000;
                if (m < 1) {
                    message.channel.send(`Wait at least 10 minutes (1 for last game's op) before starting a new game`)
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject()
                }
                else if (m < 10) {
                    if (Perm.checkRoles(gConfig, message.member, state.opId, { admin: true, op: true }))
                        resolve()
                    else {
                        message.channel.send(`Wait at least 10 minutes (1 for last game's op) before starting a new game`)
                        // eslint-disable-next-line prefer-promise-reject-errors
                        reject()
                    }
                }
                else {
                    resolve();
                }
            })
    });
}