
const GC = require(`./guildConfig.js`);
const logger = require(`../../logger`);
const chalk = require('chalk');
const sheet = require(`./sheet`);

module.exports = function addPicker(msg, player, playerSlot) {

    //add reaction
    numReact(msg, 0, player.civs.length);
    //set reaction filter
    const filter = (reaction, user) => {
        return [`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`].slice(0, player.civs.length).includes(reaction.emoji.name) && !user.bot;
    };
    const collector = msg.createReactionCollector(filter, { idle: 900000 });
    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] created pick collector ${playerSlot}`);

    collector.on('collect', (reaction, user) => {
        reaction.users.remove(user);

        if (`${user}` != `${player.id}`)
            return;
        msg.reactions.removeAll();
        let state = GC.getGameState(msg.guild);

        let pick = player.civs[[`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`].indexOf(reaction.emoji.name)];
        logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] [${chalk.magentaBright(user.tag)}] pick ${pick.Name}`);
        state.Players[playerSlot - 1].pick = pick;
        sheet.updateGame(state);
        GC.setGameState(msg.guild, state);

    });
    collector.on('end', (reaction, user) => {
        logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] pick collector committed die ${playerSlot}`);
        msg.reactions.removeAll();
        let state = GC.getGameState(msg.guild)
        state.flushed = true;
        GC.setGameState(msg.guild, state);
        sheet.updateGame(state);
    });
}

function numReact(msg, i, max) {
    msg.react([`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`][i])
        .then(() => {
            i++;
            if (i < max && i < 6) {
                numReact(msg, i, max);
            }
        })
}