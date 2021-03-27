/* global logger */
const Picker = require(`./picker`);
const mergeImg = require('merge-img');
const rand = require(`./randomizer`)
function StartJoins(state) {
    state.embed.updateField("Game Phase", "**Joining** \n Click  ✅  to join \n Click  ❎  to leave\n Click  ⏩  to end phase (Operator)\n `dlc` to manage DLCs (Operator)\n `set` to change CPP/BPP (Operator)\n\u200B")
    state.updatePhase("join")
}
function StartBans(state) {
    state.updatePhase("bans");
    state.embed.updateField("Game Phase", "**Bans**\n Click  ➡️  to skip 1 ban  \n Click  ⏩  to end phase (Operator) \n `ban [civId/civName]` to ban civilization\n\u200B")
    state.embed.updateField("Players", `${state.players.map(user => `<@${user.id}>`).join('\n')}\u200B`)
    state.embed.addFields(
        { name: 'Bans', value: '\u200B', inline: true },
        { name: 'Pick', value: '\u200B', inline: true },
        { name: 'Banned civs', value: '\u200B', inline: false }
    );
    state.embed.updateField("Bans", `${state.players.map(user => `[${user.bans.length}/${state.bpp}]`).join(', ')}\u200B`)
    state.embed.setColor('#de3b09')
}
function StartPicks(state) {
    state.embed.updateField("Game Phase", "**Picks** \n Click 🔁 to vote for reroll\n Click 🔁 again to remove vote\n Click 🔢 to pick (for stats)\n\u200B")

    state.embed.setColor('#09ded0');
    state.updatePhase("picks")
    let pickField = state.embed.fields.find(field => field.name == "Pick")
    if (!pickField)
        pickField = state.embed.addFields(
            { name: 'Pick', value: '\u200B', inline: true }
        );
    let reVotesField = rerollCleanup(state)//todo here

    reVotesField.value = `[${state.players.filter(p => p.reVote).length}/${state.reVotesFull}]\n${state.players.filter(p => p.reVote).map(p => `<@${p.id}>`).join('\n')}\u200B`
    pickField.value = `${state.players.map(user => {
        let civ = state.civList.find(x => x.id == user.pick)
        if (civ)
            return civ.name
        return '-'
    }).join('\n')}\u200B`
    state.embedMsg.edit(state.embed)

    generatePicks(state);
    sendPicks(state)
}
module.exports = {
    startJoins: StartJoins,
    startBans: StartBans,
    startPicks: StartPicks
}

function rerollCleanup(state) {
    let reVotesField = state.embed.fields.find(field => field.name == "Reroll Votes")
    if (reVotesField) {
        //TODO REMOVE OLD PICK MSGS
        //GC.setPickMsgs(channel.guild, []);
        state.addReroll()
        state.resetAllPlayerReVotes()
        state.embed.updateField("Rerolls", state.rerolls)
    }
    else {
        reVotesField = state.embed.addField('Reroll Votes', `[${state.players.filter(x => x.reVote).length}/${state.reVotesFull}]\n`, false);
        state.embed.addFields(
            { name: 'Rerolls', value: '0', inline: true }
        );
    }
    return reVotesField
}


function generatePicks(state) {
    rand.shuffle(state.civs)
    for (const player of state.players) {
        for (let i = 0; i < state.cpp; i++) {
            state.addPickedCiv(state.civs.shift(), player)
        }
    }
}

function sendPicks(state) {
    for (const player of state.players) {
        let civs = player.civs.map(x => state.civList.find(y => y.id == x))
        mergeImg(civs.map(x => `./assets/${x.path}`)).then(
            image => {
                image.write(`./assets/Imgs/Players/${state.guildId}-${player.slot}.png`,
                    () => {
                        state.embedMsg.channel.send(civs.map(x => x.name).join(`/`), {
                            files: [`./assets/Imgs/Players/${state.guildId}-${player.slot}.png`]
                        }).then(msg => {
                            state.addPickMsg(msg)
                            Picker.add(msg, player, state);
                        })
                    })
            },
            err => {
                logger.log(`error`, `mergeImg error\n${err}`)
                state.embedMsg.channel.send(`${civs.map(x => x.name).join(`/`)} [failed to add imgs]`).then(msg => {
                    state.addPickMsg(msg)
                    Picker.add(msg, player, state);
                })
            })
    }
}

//TODO may be needed
function removeOld(mess, max) {
    try {
        if (mess.reactions.cache.some(x => x.emoji.name == [`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`][max - 1]))
            mess.delete().catch(err => { throw new Error(`delete [${mess.guild.name}] [${mess.channel.name}] \n${err}`) })
        else {
            setTimeout(() => removeOld(mess, max), 525);
        }
    }
    catch (error) {
        logger.log(`error`, `Error in removeOld ${error.stack}`)
    }

}