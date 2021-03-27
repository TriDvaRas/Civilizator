
const Discord = require('discord.js');

module.exports = {
    create: createEmbed,
}


Discord.MessageEmbed.prototype.updateField = function updateField(fieldName, value) {
    let field = this.fields?.find(field => field.name == fieldName)
    if (field) {
        field.value = value
        return this
    }
    return false
}


function createEmbed() {
    return new Discord.MessageEmbed()
        .setColor('#46a832')
        .setTitle("**Civilizator Game**")
        .setDescription("**[Civilizations List](https://docs.google.com/spreadsheets/d/e/2PACX-1vR5u67tm62bbcc5ayIByMOeiArV7HgYvrhHYoS2f84m0u4quPep5lHv9ghQZ0lNvArDogYdhuu1_f9b/pubhtml)**")
        .addFields(
            { name: 'Game Operator', value: '\u200B', inline: true },
            { name: 'Game Id', value: '\u200B', inline: true },
            { name: 'Game', value: '\u200B', inline: true },
            { name: 'Game Phase', value: '\u200B', inline: false },
            { name: 'DLCs', value: 'All', inline: true },
            { name: 'Civs per player', value: '\u200B', inline: true },
            { name: 'Bans per player', value: '\u200B', inline: true },
            { name: 'Players', value: '\u200B', inline: true }
        )
        .setFooter('Created by TriDvaRas#4805', 'https://tdr.s-ul.eu/hP8HuUCR');
}
