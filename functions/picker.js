/* global logger chalk activeGames */
const GC = require(`./guildConfig.js`);
const Embeder = require(`./embeder.js`);
const db = require(`./db`);

module.exports = {
    add: addPicker
}

function addPicker(msg, player) {
    //add reactions
    numReact(msg, player);
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

            db.getState(activeGames.findKey(x => x.guildId == msg.guild.id)).then(
                state => {
                    //TODO do i really need this?
                    //state.setFlushed()
                },
                error => logger.log(`error`, `${error}`)
            )
        }
    });

}

function onPickerCollect(msg, playerSlot, reaction, user) {
    if (msg.deleted)
        return;
    reaction.users.remove(user)
    if (!msg.mentions.users.has(user.id)) {
        return;
    }
    db.getState(activeGames.findKey(x => x.guildId == msg.guild.id)).then(
        state => {
            let player = state.players.find(P => P.slot == playerSlot)
            let expectedPicks = player.civs.map(civ => civ.Name).join(`/`);
            if (msg.content.split(`\n`)[1] != expectedPicks) {
                return;
            }
            let pick = player.civs[[`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`].indexOf(reaction.emoji.name)];
            logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] [${chalk.magentaBright(user.tag)}] pick ${pick.Name}`);
            state.setPlayerPick(pick, player)

            state.embed.updateField("Pick", `${state.Players.map(user => user.pick.Name).join('\n')}\u200B`)
            state.embedmsg.edit(state.embed);
        },
        error => logger.log(`error`, `${error}`)
    )
}

function numReact(msg, player) {
    try {
        for (let i = 0; i < player.civs.length; i++)
            if (!msg.deleted)
                msg.react([`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`][i]).then(() => { }, error => {
                    logger.log(`error`, ` Error on numReact ${msg} ${i} ${player.civs.length} \n${error.stack}`);

                })
    } catch (error) {
        logger.log(`error`, ` Error on numReact ${msg} ${i} ${player.civs.length} \n${error.stack}`);
    }

}