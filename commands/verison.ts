import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import api from "../api/api";
import gameVersions from '../assets/json/gameVersions.json'
import { toKeyValue } from "../util/objects";
import * as pjson from '../package.json'
export default {
    name: 'version',
    execute: async (interaction: CommandInteraction) => {
        const embed = new MessageEmbed()
            .setTitle(`Civilizator Versions`)
            .addField(`Bot Version`, `${pjson.version}\u200B`, true)
            .addField(`API Version`, `${await api.get(`/version`)}\u200B`, true)
            .addField(`Civlist versions`, `${toKeyValue(gameVersions).map(x => `${x.key.toUpperCase()} - v${x.value}`).join(`\n`)}\u200B`, false)
            .setColor(`RANDOM`)
        interaction.reply({ embeds: [embed] })
    }
}