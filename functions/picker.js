/* global logger chalk activeGames */
const db = require(`./db`);

module.exports = {
    add: addPicker
}

function addPicker(msg, player) {
    //add reactions
    numReact(msg, player, 0);
    const collector = msg.createReactionCollector((reaction, user) => [`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`].slice(0, player.civs.length).includes(reaction.emoji.name) && !user.bot);
    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] created pick collector ${player.slot}`);
    collector.on('collect', (reaction, user) => {
        onPickerCollect(msg, player.slot, reaction, user)
    });
    collector.on('end', (collected, reason) => {
        logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] pick collector ${player.slot} committed die  reason ${reason}`);
        if (reason == `game flushed`) {
            msg.reactions.removeAll();
            logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] cleared reactions of pick collector ${player.slot}`);
        }
    });

}

function onPickerCollect(msg, playerSlot, reaction, user) {
    if (msg.deleted)
        return;
    reaction.users.remove(user)
    if (!msg.mentions.users.has(user.id))
        return;
    db.getState(activeGames.findKey(x => x.guild.id == msg.guild.id)).then(
        state => {
            let player = state.players.find(P => P.slot == playerSlot)
            let expectedPicks = player.civs.map(x => state.civList.find(y => y.id == x).name).join(`/`);
            if (msg.content.split(`\n`)[1] != expectedPicks)
                return;
            let pick = player.civs[[`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`].indexOf(reaction.emoji.name)];
            logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] [${chalk.magentaBright(user.tag)}] pick ${pick}`);
            state.setPlayerPick(pick, player)
            state.embed.updateField("Pick", `${state.players.map(p => p.pick ? state.civList.find(y => y.id == p.pick).name : `-`).join('\n')}\u200B`)
            state.embedMsg.edit(state.embed);
        },
        error => logger.log(`error`, `${error}`)
    )
}

function numReact(msg, player, i) {
    if (!msg.deleted && i < player.civs.length)
        msg.react([`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`][i]).then(
            () => {
                numReact(msg, player, i + 1)
            },
            () => { })
}