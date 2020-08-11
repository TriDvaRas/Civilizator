
const Discord = require('discord.js');
const logger=require(`../../logger`);
const chalk = require('chalk');
module.exports = {
    create: createEmbed,
    get: getEmbed,
    set: setEmbed,
}

function createEmbed() {
    return new Discord.MessageEmbed()
        .setColor('#46a832')
        .setTitle("**Civilization V Game**")
        .setDescription("**[Civilization List](https://docs.google.com/spreadsheets/d/e/2PACX-1vR5u67tm62bbcc5ayIByMOeiArV7HgYvrhHYoS2f84m0u4quPep5lHv9ghQZ0lNvArDogYdhuu1_f9b/pubhtml?gid=0&single=true)**")
        .setThumbnail('https://tdr.s-ul.eu/Cz9IF5oS')
        .addFields(
            { name: 'Game Operator', value: '\u200B', inline: true },
            { name: 'Game Id', value: '\u200B', inline: true },
            { name: 'Game Phase', value: '\u200B', inline: false },
            { name: 'DLCs', value: 'All', inline: true },
            { name: 'Civs per player', value: '\u200B', inline: true },
            { name: 'Bans per player', value: '\u200B', inline: true },
            { name: 'Players', value: '\u200B', inline: true }
        )
        .setTimestamp()
        .setFooter('Created by TriDvaRas', 'https://tdr.s-ul.eu/hP8HuUCR');
}

function getEmbed(gameState, channel) {
    return channel.messages.cache.array().find(msg=>msg.id==gameState.embedId).embeds[0];
}
function setEmbed(gameState, channel, embed) {
    channel.messages.cache.array().find(msg=>msg.id==gameState.embedId).edit(embed);
}