
const GC = require(`./guildConfig.js`);
const logger = require(`../logger`);
const Embeder = require(`./embeder.js`);
const chalk = require('chalk');
const DB = require(`./db`);

module.exports = {
    add: addPicker
}

function addPicker(msg, player, playerSlot) {
    try {
        //add reaction
        numReact(msg, player);

        //set reaction filter
        const filter = (reaction, user) => {
            return [`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`].slice(0, player.civs.length).includes(reaction.emoji.name) && !user.bot;
        };
        const collector = msg.createReactionCollector(filter, { idle: globalThis.reactionsMaxTime });
        logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] created pick collector ${playerSlot}`);

        collector.on('collect', (reaction, user) => {
            try {
                if (msg.deleted)
                    return;
                reaction.users.remove(user).then(() => { }, () => { });

                if (!msg.mentions.users.has(user.id)) {
                    return;
                }
                GC.getGameState(msg.guild).then(state => {

                    let actualPicks = msg.content.split(`\n`)[1];
                    let expectedPicks = state.Players.find(P => P.id == player.id).civs.map(civ => civ.Name).join(`/`);
                    if (actualPicks != expectedPicks) {
                        return;
                    }
                    let pick = player.civs[[`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`].indexOf(reaction.emoji.name)];
                    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] [${chalk.magentaBright(user.tag)}] pick ${pick.Name}`);
                    state.Players[playerSlot - 1].pick = pick;

                    DB.updateGame(state);

                    let embed = Embeder.get(state, msg.channel);
                    embed.fields.find(field => field.name == "Pick").value = state.Players.map(user => user.pick.Name).join('\n') + '\u200B';
                    Embeder.set(state, msg.channel, embed);
                    GC.setGameState(msg.guild, state);

                },
                    error => logger.log(`error`, `${error}`)
                )

            } catch (error) {

                logger.log(`error`, `[${chalk.magentaBright(msg.guild.name)}] Error on collecting pick ${error.stack}`);
            }
        });
        collector.on('end', (collected, reason) => {
            try {
                logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] pick collector ${playerSlot} committed die  reason ${reason}`);

                if (reason == `idle`) {
                    msg.reactions.removeAll();
                    logger.log(`cmd`, `[${chalk.magentaBright(msg.guild.name)}] cleared reactions of pick collector ${playerSlot}`);

                    GC.getGameState(msg.guild).then(state => {
                        state.flushed = true;
                        GC.setGameState(msg.guild, state);
                        setTimeout(() => DB.updateGameFinal(msg.guild), globalThis.finalDelay)

                    },
                        error => logger.log(`error`, `${error}`)
                    )
                }

            } catch (error) {
                logger.log(`error`, `[${chalk.magentaBright(msg.guild.name)}] Error on ending pick ${error.stack}`);

            }
        });
    } catch (error) {
        logger.log(`error`, `[${chalk.magentaBright(msg.guild.name)}] Picker creation ${error.stack}`);

    }
}

async function numReact(msg, player) {
    try {
        for (let i = 0; i < player.civs.length; i++)
            if (!msg.deleted)
                msg.react([`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`][i]).then(()=>{},error => {
                    logger.log(`error`, ` Error on numReact ${msg} ${i} ${player.civs.length} \n${error.stack}`);

                })
    } catch (error) {
        logger.log(`error`, ` Error on numReact ${msg} ${i} ${player.civs.length} \n${error.stack}`);
    }

}