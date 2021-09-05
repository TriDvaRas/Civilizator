import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import api from "../api/api";

export default {
    name: 'version',
    execute: async (interaction: CommandInteraction) => {
        const embed = new MessageEmbed()
            .setTitle(`Civilizator Versions`)
            .addField(`Bot Version`, `${process.env.npm_package_version}\u200B`, true)
            .addField(`API Version`, `${await api.get(`/version`)}\u200B`, true)
            .setColor(`RANDOM`)
        interaction.reply({ embeds: [embed] })
    }
}