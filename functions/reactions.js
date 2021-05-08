/*global logger, chalk, discordClient */
const GC = require(`./guildConfig.js`);
const Embeder = require(`./embeder.js`);
const Perm = require('./Permissions.js');
const Phaser = require('./Phaser.js');
const BanF = require('../functions/BansFunctions.js');
const db = require(`./db`);

module.exports = {
    addJoiner,
    addBanner,
    addReroller,
    startPicks
}

function addJoiner(msg, ag) {
    //add reaction
    msg.react(`✅`)
        .then(() => msg.react(`❎`))
        .then(() => msg.react(`⏩`));
    //set reaction filter
    const collector = msg.createReactionCollector((reaction, user) => [`✅`, `❎`, `⏩`].includes(reaction.emoji.name) && !user.bot);
    ag.collectors.push(collector)

    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] created join collector`);
    collector.on('collect', (reaction, user) => {
        onJoinCollect(msg, ag, collector, reaction, user)
    });
    collector.on('end', (collected, reason) => {
        logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] join collector committed die | reason ${reason}`);
        if (reason != `messageDelete`)
            msg.reactions.removeAll();
        ag.collectors.splice(ag.collectors.indexOf(collector), 1)
        if ([`idle`, `new game`].includes(reason))
            db.getState(ag.gameId).then(
                state => state.setFlushed(),
                error => logger.log(`error`, `${error}`)
            )

    });
}

function addBanner(msg, ag) {
    //add reaction
    msg.react(`➡️`)
        .then(() => msg.react(`⏩`));
    //set reaction filter
    const collector = msg.createReactionCollector((reaction, user) => [`➡️`, `⏩`].includes(reaction.emoji.name));
    ag.collectors.push(collector)
    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] created banner collector`)
    collector.on('collect', (reaction, user) => {
        onBanCollect(msg, ag, collector, reaction, user)
    });
    collector.on('end', (collected, reason) => {
        logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] banner collector committed die | reason ${reason}`);
        if (reason != `messageDelete`)
            msg.reactions.removeAll();
        ag.collectors.splice(ag.collectors.indexOf(collector), 1)
        if ([`idle`, `new game`].includes(reason))
            db.getState(ag.gameId).then(
                state => state.setFlushed(),
                error => logger.log(`error`, `${error}`)
            )
    });
}
// eslint-disable-next-line max-lines-per-function
function addReroller(msg, ag) {
    //add reaction
    msg.react(`🔁`);
    //set reaction filter
    const collector = msg.createReactionCollector((reaction, user) => [`🔁`].includes(reaction.emoji.name) && !user.bot);
    ag.collectors.push(collector)
    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] created re collector`);

    collector.on('collect', (reaction, user) => {
        onReCollect(msg, ag, collector, reaction, user)
    });
    collector.on('end', (collected, reason) => {
        logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] re collector committed die | reason ${reason}`);
        if (reason != `messageDelete`)
            msg.reactions.removeAll();
        ag.collectors.splice(ag.collectors.indexOf(collector), 1)
        if ([`idle`, `new game`].includes(reason))
            db.getState(ag.gameId).then(
                state => state.setFlushed(),
                error => logger.log(`error`, `${error}`)
            )
    });
}
//--------


function onJoinCollect(msg, agState, collector, reaction, user) {
    reaction.users.remove(user);
    db.getState(agState.gameId).then(
        state => {
            if (state.embedId != msg.id) {
                collector.stop(`old game`);
                return;
            }
            if (reaction.emoji.name === '⏩') {
                endJoinPhase(msg, agState, state, reaction, user, collector)
            }
            else {
                if (reaction.emoji.name === '✅') {
                    if (state.players.find(P => P.id == user.id))
                        return;
                    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] [${chalk.magentaBright(user.tag)}] player joined`);
                    state.addPlayer(user)
                }
                else {
                    let player = state.players.find(P => P.id == user.id)
                    if (!player)
                        return;
                    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] [${chalk.magentaBright(user.tag)}] player left`);
                    state.remPlayer(user)
                }
                state.embed.updateField("Players", `${state.players.map(user => `<@${user.id}>`).join('\n')}\u200B`)
                state.embedMsg.edit(state.embed);
            }
        },
        error => logger.log(`error`, `${error}`)
    )
}
function endJoinPhase(msg, agState, state, reaction, user, collector) {
    //check perm
    db.getGuildConfig(msg.guild.id)
        .then(gConfig => {
            if (Perm.checkRoles(gConfig, msg.guild.member(user), state.opId, { admin: true, op: true })) {
                //check if players
                if (state.players.length < 1) {
                    msg.channel.send(`Can't start game without players`)
                        .then(m => m.delete({ timeout: 7500 }))
                    return;
                }
                //check size
                let size = state.players.length * (state.cpp + state.bpp)
                let maxSize = state.civs.length
                if (size > maxSize) {
                    msg.channel.send(`Not enough civs for all players\nCivs in pool: \`${maxSize}\`\nCivs needed to start: \`${size}\`(players count*(CPP+BPP))\nTry lowering **C**ivs/**B**ans **P**er **P**layer values with \`set\` command\nor enabling more DLCs with \`dlc\` command`)
                        .then(m => m.delete({ timeout: 12500 }))
                    return;
                }
                //go to next phase
                collector.stop("force end");
                logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] joins ended`);
                if (state.bpp > 0) {
                    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] starting bans`);
                    Phaser.startBans(state, state.embed);
                    addBanner(msg, agState);
                    state.embedMsg.edit(state.embed);
                }
                else {
                    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] skiping bans`);
                    startPicks(msg, agState, state)
                }
            }


        })
}

function onBanCollect(msg, agState, collector, reaction, user) {
    db.getState(agState.gameId).then(
        state => {
            if (state.embedId != msg.id) {
                collector.stop(`old game`);
                return;
            }
            if (user.id == discordClient.user.id)
                return;
            reaction.users.remove(user);
            if (reaction.emoji.name === '➡️') {
                skipBan(msg, agState, state, reaction, user, collector)
            }
            else if (reaction.emoji.name === '⏩') {
                endBanPhase(msg, agState, state, reaction, user, collector)
            }
        },
        error => logger.log(`error`, `${error}`)
    )
}

function skipBan(msg, agState, state, reaction, user, collector) {
    if (!state.players.find(P => P.id == user.id)) return
    if (!BanF.checkCanBan(state, user)) return

    state.addBan(user, 0)
    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] [${chalk.magentaBright(user.tag)}] ban skip [${state.players.map(x => x.bans.length).reduce((a, b) => a + b)}/${state.bansFull}]`);
    state.embed.updateField("Bans", `${state.players.map(user => `[${user.bans.length}/${state.bpp}]`).join('\n')}\u200B`)
    state.embed.updateField("Banned civs", `${state.banned.map(id => state.civList.find(x => x.id == id).name).join(', ')}\u200B`)
    state.embedMsg.edit(state.embed)
    if (state.players.map(x => x.bans.length).reduce((a, b) => a + b) >= state.bansFull) {
        logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] bans ended`);
        collector.stop("full");
        startPicks(msg, agState, state)
    }
}
function endBanPhase(msg, agState, state, reaction, user, collector) {
    db.getGuildConfig(msg.guild.id)
        .then(gConfig => Perm.checkRoles(gConfig, msg.guild.member(user), state.opId, { admin: true, op: true }))
        .then(() => {
            logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] bans fended`);
            collector.stop("force end");
            startPicks(msg, agState, state)
        })
}

function startPicks(msg, agState, state) {
    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] starting picks`);
    Phaser.startPicks(state);
    addReroller(msg, agState);
    state.embedMsg.edit(state.embed);
}

function onReCollect(msg, agState, collector, reaction, user) {
    reaction.users.remove(user);
    db.getState(agState.gameId).then(
        state => {
            if (state.embedId != msg.id) {
                collector.stop(`old game`);
                return;
            }
            let player = state.players.find(P => P.id == user.id)
            if (!player) return
            if (player.reVote) {
                state.remReVote(user)
                logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] [${chalk.magentaBright(user.tag)}] -re vote [${state.players.filter(x => x.reVote).length}/${state.reVotesFull}]`);
            }
            else {
                state.addReVote(user)
                logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] [${chalk.magentaBright(user.tag)}] +re vote [${state.players.filter(x => x.reVote).length}/${state.reVotesFull}]`);
            }
            state.embed.updateField("Reroll Votes", `[${state.players.filter(x => x.reVote).length}/${state.reVotesFull}]\n ${state.players.filter(x => x.reVote).map(user => `<@${user.id}>`).join(' ')}`)
            state.embedMsg.edit(state.embed)
            if (state.players.filter(x => x.reVote).length >= state.reVotesFull) {
                logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] rerolling`);
                Phaser.startPicks(state);
            }
        },
        error => logger.log(`error`, `${error}`)
    )

}