import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import api from "../api/api";
import { createAnonPicksMessage } from "../managers/rollManager";
import { ICivilization } from "../types/api";
import { randFrom } from "../util/random";

export default {
    name: 'rollcivs',
    execute: async (interaction: CommandInteraction) => {
        const gameName = interaction.options.getString(`game`, true)
        const amount = interaction.options.getInteger(`amount`, true)
        await interaction.deferReply()
        try {
            const civlist = (await api.get(`/civlist/${gameName}`) as ICivilization[]).filter(x => x.personaId !== x.id)
            const rolled: ICivilization[] = []
            for (let i = 0; i < amount; i++) {
                const civ = randFrom(civlist.filter(x => !rolled.includes(x)))
                rolled.push(civ)
            }
            const message = await createAnonPicksMessage(rolled)
            interaction.editReply(message)
        } catch (error) {
            interaction.editReply(`Unexpected error while processing your interaction. It was logged, but if you want it to be fixed sooner you can message ${process.env.BOT_OWNER_TAG} about this`)
            log.error(error)
        }


    }
}