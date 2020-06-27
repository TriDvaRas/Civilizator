
const GC = require(`./guildConfig.js`);
const Embeder = require(`./embeder.js`);
const Perm = require('./Permissions.js');
const Phaser = require('./Phaser.js');
const logger = require(`../../logger`);
const chalk = require('chalk');
const sheet = require(`./sheet`);
const IO = require('./IO.js');

module.exports = {
    addJoiner,
    addBanner,
    addReroller
}

function addJoiner(msg) {
    //add reaction
    msg.react(`✅`)
        .then(() => msg.react(`❎`))
        .then(() => msg.react(`⏩`));
    //set reaction filter
    const filter = (reaction, user) => {
        return [`✅`, `❎`, `⏩`].includes(reaction.emoji.name) && !user.bot;
    };
    const collector = msg.createReactionCollector(filter, { idle: 300000 });
    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] created join collector`);

    collector.on('collect', (reaction, user) => {
        reaction.users.remove(user);
        let state = GC.getGameState(msg.guild);
        if (state.embedId != msg.id) {
            collector.stop(`old game`);
            return;
        }
        let member = msg.guild.members.cache.array().find(M => M.user = user);
        if (reaction.emoji.name === '⏩') {
            //check perm
            if (!Perm.checkRoles(member, state.Op, { admin: true, op: true }))
                return;
            //check size
            let size = state.Players.length * (state.banSize + state.playerSize)
            let maxSize = state.Civs.length;
            if (size > maxSize) {
                msg.channel.send(`Not enough civs for all players
Civs in pool: \`${maxSize}\`
Civs needed to start: \`${size}\`(players count*(CPP+BPP))
Try lowering **C**ivs/**B**ans **P**er **P**layer values with \`set\` command 
or enabling more DLCs with \`dlc\` command`).then(m => m.delete({ timeout: 12500 }));
            }

            //go to next phase
            collector.stop();
            let embed = Embeder.get(state, msg.channel);

            logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] joins ended`);
            if (state.banSize > 0) {
                try {
                    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] starting bans`);
                    Phaser.StartBans(state, embed);
                    addBanner(msg);
                    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] started bans`);
                } catch (error) {
                    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] failed starting bans ${error}`);

                }
            }
            else {
                try {
                    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] skiping bans`);
                    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] starting picks`);
                    Phaser.StartPicks(state, embed, msg.channel);
                    addReroller(msg);
                    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] started picks`);
                } catch (error) {
                    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] failed starting picks ${error}`);

                }
            }

            GC.setGameState(msg.guild, state);
            msg.edit(embed);
        }
        else {
            if (reaction.emoji.name === '✅') {
                if (state.Players.find(P => P.id == `${user}`))
                    return;
                logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] [${chalk.magentaBright(user.tag)}] player joined`);

                state.Players.push({
                    tag: user.tag,
                    id: `${user}`,
                    bans: [],
                    civs: [],
                    pick: "",
                    civsMessage: ""
                });
                state.gameSize = parseInt(state.gameSize) + 1;
            }
            else {
                let player = state.Players.find(P => P.id == `${user}`)
                if (!player)
                    return;
                logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] [${chalk.magentaBright(user.tag)}] player left`);
                state.Players.splice(state.Players.indexOf(player), 1);
                state.gameSize = parseInt(state.gameSize) - 1;
            }
            GC.setGameState(msg.guild, state);
            let embed = Embeder.get(state, msg.channel);
            embed.fields.find(field => field.name == "Players").value = state.Players.map(user => user.id).join('\n') + '\u200B';
            msg.edit(embed);
        }
    });
    collector.on('end', (collected, reason) => {
        logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] join collector committed die | reason ${reason}`);
        msg.reactions.removeAll();
        if ([`idle`,`new game`].includes(reason)) {
            let state = GC.getGameState(msg.guild)
            state.flushed = true;
            GC.setGameState(msg.guild, state);
            sheet.updateGame(state);
        }
    });
}

function addBanner(msg) {
    //add reaction
    msg.react(`➡️`)
        .then(() => msg.react(`⏩`));
    //set reaction filter
    const filter = (reaction, user) => {
        return [`➡️`, `⏩`, `✔️`].includes(reaction.emoji.name) && (!user.bot || user.id == 719933714423087135);
    };
    const collector = msg.createReactionCollector(filter, { idle: 300000 });
    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] created banner collector`);

    collector.on('collect', (reaction, user) => {
        let state = GC.getGameState(msg.guild);
        if (state.embedId != msg.id) {
            collector.stop(`old game`);
            return;
        }
        if (reaction.emoji.name === '✔️') {
            if (user.id != 719933714423087135)
                return;
            reaction.users.remove(user);
            let embed = Embeder.get(state, msg.channel);
            collector.stop();
            Phaser.StartPicks(state, embed, msg.channel);
            addReroller(msg);

            GC.setGameState(msg.guild, state);
            msg.edit(embed);
            return;
        }
        if (user.id == 719933714423087135)
            return;
        reaction.users.remove(user);
        if (reaction.emoji.name === '➡️') {
            let player = state.Players.find(P => P.id == `${user}`)
            if (!player)
                return;
            state.Banners.push(`${user}`);
            player.bans.push({
                "id": "0",
                "Name": "Skip"
            });
            state.bansActual = parseInt(state.bansActual) + 1;

            logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] [${chalk.magentaBright(user.tag)}] ban skip [${state.bansActual}/${state.bansFull}]`);
            let civList = IO.Read(`assets/CivList.json`);
            let embed = Embeder.get(state, msg.channel);
            embed.fields.find(field => field.name == "Bans").value = state.Players.map(user => `[${user.bans.length}/${state.banSize}]`).join('\n') + '\u200B';
            embed.fields.find(field => field.name == "Banned civs").value = state.banned.map(id => civList.find(x => x.id == id).Name).join('\n') + '\u200B';
            Embeder.set(state, msg.channel, embed)
            GC.setGameState(msg.guild, state);
            if (state.bansActual >= state.bansFull) {
                logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] bans ended`);
                msg.react(`✔️`);
            }

        }
        else if (reaction.emoji.name === '⏩') {
            if (!Perm.checkRoles(msg.guild.members.cache.array().find(M => M.user = user), state.Op, { admin: true, op: true }))
                return;

            logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] bans ended`);
            let embed = Embeder.get(state, msg.channel);
            collector.stop();
            try {
                logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] starting picks`);
                Phaser.StartPicks(state, embed, msg.channel);
                addReroller(msg);
                logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] started picks`);
            } catch (error) {
                logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] failed starting picks ${error}`);
            }

            GC.setGameState(msg.guild, state);
            msg.edit(embed);
        }
    });
    collector.on('end', (collected, reason) => {
        logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] banner collector committed die | reason ${reason}`);
        msg.reactions.removeAll();
        if ([`idle`,`new game`].includes(reason)) {
            let state = GC.getGameState(msg.guild)
            state.flushed = true;
            GC.setGameState(msg.guild, state);
            sheet.updateGame(state);
        }
    });
}
function addReroller(msg) {
    //add reaction
    msg.react(`🔁`);
    //set reaction filter
    const filter = (reaction, user) => {
        return [`🔁`].includes(reaction.emoji.name) && !user.bot;
    };
    const collector = msg.createReactionCollector(filter, { idle: 900000 });
    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] created re collector`);

    collector.on('collect', (reaction, user) => {
        reaction.users.remove(user);
        let state = GC.getGameState(msg.guild);
        if (state.embedId != msg.id) {
            collector.stop(`old game`);
            return;
        }
        let player = state.Players.find(P => P.id == `${user}`)
        if (!player)
            return;
        state.reVoters.push(player);
        state.reVotes = parseInt(state.reVotes) + 1;
        logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] [${chalk.magentaBright(user.tag)}] re vote [${state.reVotes}/${state.reVotesFull}]`);

        let embed = Embeder.get(state, msg.channel);
        embed.fields.find(field => field.name == "Reroll Votes").value = `[${state.reVotes}/${state.reVotesFull}]\n` + state.reVoters.map(user => user.id).join('\n') + '\u200B';
        Embeder.set(state, msg.channel, embed)
        if (state.reVotes >= state.reVotesFull) {
            msg.reactions.removeAll();
            setTimeout(() =>
                msg.react(`🔁`), 1000)
            logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] rerolling`);
            Phaser.StartPicks(state, embed, msg.channel);
        }
        GC.setGameState(msg.guild, state);

    });
    collector.on('end', (collected, reason) => {
        logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] re collector committed die | reason ${reason}`);
        msg.reactions.removeAll();
        let state = GC.getGameState(msg.guild)
        if ([`idle`,`new game`].includes(reason)) {
            state.flushed = true;
            GC.setGameState(msg.guild, state);
        }
        sheet.updateGame(state);
    });
}

