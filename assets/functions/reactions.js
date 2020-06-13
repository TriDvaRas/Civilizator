
const GC = require(`./guildConfig.js`);
const Embeder = require(`./embeder.js`);
const Perm = require('./Permissions.js');
const Phaser = require('./Phaser.js');
const logger=require(`../../logger`);

module.exports = {
    addJoiner,
    addBanner,
    addPicker
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

    collector.on('collect', (reaction, user) => {
        reaction.users.remove(user);
        let state = GC.getGameState(msg.guild);
        let member = msg.guild.members.cache.array().find(M => M.user = user);
        if (reaction.emoji.name === '⏩') {
            if (!Perm.checkRoles(member, state.Op, { admin: true, op: true }))
                return;
            let embed = Embeder.get(state, msg.channel);
            collector.stop();

            if (state.banSize > 0) {
                Phaser.StartBans(state, embed);
                addBanner(msg);
            }
            else {
                Phaser.StartPicks(state, embed, msg.channel);
                addPicker(msg);
            }

            GC.setGameState(msg.guild, state);
            msg.edit(embed);
        }
        else {
            if (reaction.emoji.name === '✅') {
                if (state.Players.find(P => P.id == `${user}`))
                    return;
                state.Players.push({
                    tag: user.tag,
                    id: `${user}`,
                    bans: []
                });
                state.gameSize = parseInt(state.gameSize) + 1;
            }
            else {
                let player = state.Players.find(P => P.id == `${user}`)
                if (!player)
                    return;
                state.Players.splice(state.Players.indexOf(player), 1);
                state.gameSize = parseInt(state.gameSize) - 1;
            }
            GC.setGameState(msg.guild, state);
            let embed = Embeder.get(state, msg.channel);
            embed.fields.find(field => field.name == "Players").value = state.Players.map(user => user.id).join('\n') + '\u200B';
            msg.edit(embed);
        }
    });
    collector.on('end', (reaction, user) => {
        msg.reactions.removeAll();
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

    collector.on('collect', (reaction, user) => {
        let state = GC.getGameState(msg.guild);
        if (reaction.emoji.name === '✔️') {
            if (user.id != 719933714423087135)
                return;
            reaction.users.remove(user);
            let embed = Embeder.get(state, msg.channel);
            collector.stop();
            Phaser.StartPicks(state, embed, msg.channel);
            addPicker(msg);

            GC.setGameState(msg.guild, state);
            msg.edit(embed);
            return;
        }
        if (user.id == 719933714423087135)
            return;
        reaction.users.remove(user);
        if (reaction.emoji.name === '➡️') {
            let player = state.Players.find(P => P.id = `${user}`)
            if (!player)
                return;
            state.Banners.push(`${user}`);
            player.bans.push({
                "id": "0",
                "Name": "Skip"
            });
            state.bansActual = parseInt(state.bansActual) + 1;
            let embed = Embeder.get(state, msg.channel);
            embed.fields.find(field => field.name == "Bans").value = state.Players.map(user => `[${user.bans.length}/${state.banSize}]`).join('\n') + '\u200B';
            embed.fields.find(field => field.name == "Banned civs").value = state.banned.join('\n') + '\u200B';
            Embeder.set(state, msg.channel, embed)
            GC.setGameState(msg.guild, state);
            if (state.bansActual >= state.bansFull) {

                msg.react(`✔️`);
            }

        }
        else if (reaction.emoji.name === '⏩') {
            if (!Perm.checkRoles(msg.guild.members.cache.array().find(M => M.user = user), state.Op, { admin: true, op: true }))
                return;
            let embed = Embeder.get(state, msg.channel);
            collector.stop();
            Phaser.StartPicks(state, embed, msg.channel);
            addPicker(msg);

            GC.setGameState(msg.guild, state);
            msg.edit(embed);
        }
    });
    collector.on('end', (reaction, user) => {
        msg.reactions.removeAll();
    });
}
function addPicker(msg) {
    //add reaction
    msg.react(`🔁`);
    //set reaction filter
    const filter = (reaction, user) => {
        return [`🔁`].includes(reaction.emoji.name) && !user.bot;
    };
    const collector = msg.createReactionCollector(filter, { idle: 900000 });

    collector.on('collect', (reaction, user) => {
        reaction.users.remove(user);

        let state = GC.getGameState(msg.guild);
        let player = state.Players.find(P => P.id = `${user}`)
        if (!player)
            return;
        state.reVoters.push(player);
        state.reVotes = parseInt(state.reVotes) + 1;

        let embed = Embeder.get(state, msg.channel);
        embed.fields.find(field => field.name == "Reroll Votes").value = `[${state.reVotes}/${state.reVotesFull}]\n` + state.reVoters.map(user => user.id).join('\n') + '\u200B';

        msg.edit(embed);
        if (state.reVotes >= state.reVotesFull) {
            deleteOldPicks();
            Phaser.StartPicks(state, embed, msg.channel);
        } else {
            GC.setGameState(msg.guild, state);
        }

    });
    collector.on('end', (reaction, user) => {
        msg.reactions.removeAll();
    });
}
function deleteOldPicks() {

}