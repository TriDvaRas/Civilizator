/* global activeGames, logger, chalk */
const db = require(`../functions/db`)
const { findBestMatch } = require("string-similarity");
const BanF = require('../functions/BansFunctions.js');
const { startPicks } = require(`../functions/reactions`)
module.exports = {
    name: 'ban',
    description: 'Bans Civilization by id or alias',
    usage: '`ban <Id/Alias>`',
    execute: function execute(message, args, guildConfig) {
        message.delete({ timeout: 5000 })
        //read GameState
        db.getState(activeGames.findKey(x => x.guild.id == message.guild.id)).then(
            state => {
                if (state.phase != "bans")
                    return message.reply("Wrong phase").then(botMsg => botMsg.delete({ timeout: 5000 }))
                //check if Player can ban
                if (!BanF.checkCanBan(state, message.author))
                    return message.reply("Out of bans").then(botMsg => botMsg.delete({ timeout: 5000 }))
                let searchRes = parseArgs(message, args, state, guildConfig)
                for (let i = 0; i < searchRes.length; i++) {
                    const civs = searchRes[i];
                    if (civs.length > 1) {
                        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] Multiple aliases for \`${args[i]}\``);
                        sendMultiple(message, args[i], civs, guildConfig)
                    }
                    else if (civs.length == 0) {
                        let sim = findSimilar(args[i], state.civList, guildConfig.locales.match(/.{2}/gu))
                        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] No aliases found for \`${args[i]}\`. Sim:[${sim.join(` `)}]`);
                        message.channel.send(`No aliases found for \`${args[i]}\`${sim?.length > 0 ? `. Similar aliases: \`${sim.join('`, `')}\`` : ``}`)
                            .then(botMsg => botMsg.delete({ timeout: 7000 }))
                        for (const str of JSON.stringify(state.civList).match(/.{1,1750}/gu))
                            logger.log('error', str)//! REMOVE DEBUG 
                    }
                    else
                        tryBan(message, state, civs[0])
                }
            },
            () => {
                logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] No game found`);
                message.channel.send("No game found. Use `start` command to create one")
                    .then(botMsg => botMsg.delete({ timeout: 5000 }))
            }
        )


    },
};


function parseArgs(message, args, state, guildConfig) {
    let Cs = []
    for (let j = 0; j < args.length && BanF.checkCanBan(state, message.author); j++) {
        let arg = args[j];
        //find civ by id
        let C = state.civList.find(civ => civ.id == arg);
        // if not found by id
        if (C)
            Cs.push([C])
        else
            Cs.push(findByAlias(arg, state, guildConfig))
    }
    return Cs
}

function tryBan(message, state, C) {
    //check if banned
    if (BanF.checkBanned(state, C)) {
        return message.channel.send(`${C.name} (${C.id}) is already banned `, {
            files: [`./assets/${C.path}`]
        }).then(botMsg => botMsg.delete({ timeout: 5000 }))
    }
    if (BanF.checkDisabled(state, C)) {
        message.channel.send(`${C.name} (${C.id}) is already disabled by DLCs settings`, {
            files: [`./assets/${C.path}`]
        }).then(botMsg => botMsg.delete({ timeout: 5000 }))
    }
    else {
        if (!BanF.checkCanBan(state, message.author))
            return message.reply(`Out of bans`).then(botMsg => botMsg.delete({ timeout: 10000 }))

        state.addBan(message.author, C.id)
        message.channel.send(`${message.author} banned ${C.name} (${C.id})\nBans: ${state.players.map(x => x.bans.length).reduce((a, b) => a + b)}/${state.bansFull}`, {
            files: [`./assets/${C.path}`]
        }).then(botMsg => botMsg.delete({ timeout: 10000 }))
        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] banned ${C.name} [${state.players.map(x => x.bans.length).reduce((a, b) => a + b)}/${state.bansFull}]`);
        state.embed.updateField("Bans", `${state.players.map(user => `[${user.bans.length}/${state.bpp}]`).join('\n')}\u200B`)
        state.embed.updateField("Banned civs", `${state.banned.map(id => state.civList.find(x => x.id == id).name).join(', ')}\u200B`)
        state.embedMsg.edit(state.embed)
        if (state.players.map(x => x.bans.length).reduce((a, b) => a + b) >= state.bansFull) {
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] Last ban, proceeding to picks`);
            let ag = { gameId: state.gameId, ...activeGames.get(state.gameId) }
            ag.collectors[0].stop("full");
            startPicks(state.embedMsg, ag, state)
        }
    }
}


function findByAlias(input, state, guildConfig) {
    return state.civList.filter(civ => {
        for (const loc of guildConfig.locales.match(/.{2}/gu))
            if (civ.aliases[loc] && civ.aliases[loc].find(x => x.toLowerCase().includes(input.toLowerCase())))
                return true
        return false
    });
}

function sendMultiple(message, arg, civs, guildConfig) {
    let locs = guildConfig.locales.match(/.{2}/gu)
    let txt = `Multiple aliases for \`${arg}\`:\n${civs.map(civ => `${civ.id}. \`${civ.name}\` - \`${locs.map(loc => civ.aliases[loc]).filter(x => x && x.length > 0).flat(3).slice(1).join(`\`, \``)}\``).join(`\n`)}`;
    message.channel.send(txt)
        .then(botMsg => botMsg.delete({ timeout: 5000 + (700 * civs.length) }))
}

function findSimilar(str, civList, locales) {
    let matches = findBestMatch(str, civList.map(x => {
        let a = []
        for (const loc of locales)
            if (x.aliases[loc])
                a.push(x.aliases[loc])
        return a
    }).flat(3))
    return matches.ratings.filter(x => x.rating > 0.13).sort((a, b) => b.rating - a.rating).slice(0, 2).map(x => x.target).filter((x, i, arr) => arr.indexOf(x) == i)
}