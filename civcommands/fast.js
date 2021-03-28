/* global logger gameNames gameLogos gameNamesLower */
const Perm = require('../functions/Permissions.js');
const Discord = require('discord.js');
const db = require('../functions/db.js');
const mergeImg = require('merge-img');
const rand = require(`../functions/randomizer`)
module.exports = {
    name: 'fast',
    description: 'Fast game (original CivRandomizer)',
    usage: '`fast [game] <Players(1-16)> <CivPerPlayer(1-6)> [-/+] [DLCs to enable/disable]`\n [game] is optional argument to choose the game you play\n Available games: civ5(default), lek, civ6',
    example: `\`fast 4 3\` - civ5, 4 players 3 civs each, all DLCs enabled
\`fast 4 3 - bnw mon\` - civ5, 4 players 3 civs each, all DLCs except BNW and Mongolia enabled
\`fast civ6 4 3 + van korea\` - civ6, 4 players 3 civs each, only Vanilla and Korea enabled
\`fast lek 2 4\` - civ5 + lek mod, 2 players 4 civs each, all DLCs enabled`,
    execute: function execute(message, args, guildConfig) {
        if (Perm.checkRoles(guildConfig, message.member, null, { admin: true, civ: true })) {
            if (Date.now() - guildConfig.lastFast < globalThis.fastCD)
                return message.channel.send(`Command is on cooldown. Try again later.`).then(botMsg => {
                    message.delete({ timeout: 5000 })
                    botMsg.delete({ timeout: 5000 })
                })
            let gameName = "Civ5";
            let index = gameNamesLower.indexOf(args[0]?.toLowerCase())
            if (index > -1) {
                gameName = gameNames[index]
                args.shift()
            }
            if (args.length < 2 || !(args[0] >= 1 && args[0] <= 16 && args[1] >= 1 && args[1] <= 6))
                return message.channel.send(`Wrong arguments. Try \`${this.name} help\` `).then(botMsg => {
                    message.delete({ timeout: 5000 })
                    botMsg.delete({ timeout: 5000 })
                })
            //get civlist
            let civList = db.civLists.get(gameName)
            let dlcs = civList.map(x => x.dlc).filter((x, i, arr) => arr.indexOf(x) == i)
            //check dlcs settings
            let white = null
            if (args[2] == "+")
                white = true;
            else if (args[2] == "-")
                white = false;
            else if (args[2])
                return message.channel.send(`Wrong arguments. Try \`${this.name} help\` `).then(botMsg => {
                    message.delete({ timeout: 5000 })
                    botMsg.delete({ timeout: 5000 })
                })
            //set dlcs
            let enDLCs = getEnabledDLCs(dlcs, args.slice(3), white)
            civList = civList.filter(x => enDLCs.includes(x.dlc) && !(enDLCs.includes(`PersonaPack`) && x.id == x.persona))
            if (civList.length < +args[0] * +args[1])
                return message.channel.send(`Not enough civs for ${args[0]}x${args[1]} game`).then(botMsg => {
                    message.delete({ timeout: 5000 })
                    botMsg.delete({ timeout: 5000 })
                })
            sendInfo(message.channel, gameName, dlcs, enDLCs, args)
            sendPicks(generatePicks(civList, args[0], args[1]), message.channel)
            db.addFastGame(message.guild.id)
        }
        else
            message.channel.send("Civ role required").then(botMsg => {
                message.delete({ timeout: 5000 })
                botMsg.delete({ timeout: 5000 })
            })
    },
};
function getEnabledDLCs(dlcs, args, white) {
    let enabled = dlcs.slice()
    if (white)
        enabled = enabled.filter(x => {
            for (const arg of args) {
                if (x.toLowerCase().includes(arg.toLowerCase()))
                    return true
            }
            return false
        })
    else
        for (const arg of args)
            enabled = enabled.filter(x => !x.toLowerCase().includes(arg.toLowerCase()))
    return enabled
}
function generatePicks(civs, playerSize, cpp) {
    rand.shuffle(civs)
    let players = []
    for (let i = 0; i < playerSize; i++) {
        let player = []
        for (let i = 0; i < cpp; i++)
            player.push(civs.shift())
        players.push(player)
    }
    return players
}
let fastCnt = 0
function sendPicks(picks, channel) {
    fastCnt = fastCnt > 3 ? 0 : fastCnt + 1
    for (let i = 0; i < picks.length; i++) {
        const civs = picks[i];
        mergeImg(civs.map(x => `./assets/${x.path}`)).then(
            image => {
                image.write(`./assets/Imgs/Players/Fast-${fastCnt}-${i}.png`,
                    () => {
                        channel.send(civs.map(x => x.name).join(`/`), {
                            files: [`./assets/Imgs/Players/Fast-${fastCnt}-${i}.png`]
                        })
                    })
            },
            err => {
                logger.log(`error`, `mergeImg error\n${err}`)
                channel.send(`${civs.map(x => x.name).join(`/`)} [failed to add imgs]`)
            })
    }
}
function sendInfo(channel, gameName, dlcs, enDLCs, args) {
    channel.send(new Discord.MessageEmbed()
        .setTitle(`Fast Game`)
        .setColor('#66D018')
        .setThumbnail(gameLogos[gameName])
        .addField(`DLCs`, dlcs.length == enDLCs.length ? `All` : enDLCs.join(`\n`), true)
        .addField(`Players`, args[0], true)
        .addField(`CPP`, args[1], true)
        .setFooter('Created by TriDvaRas#4805', 'https://tdr.s-ul.eu/hP8HuUCR')
    )
}