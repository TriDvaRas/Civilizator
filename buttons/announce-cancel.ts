import { ButtonInteraction, MessageEmbed } from "discord.js";
import * as fs from 'fs';
import path from 'path';

export default {
    customId: 'announce-cancel',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        let ann = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../assets/json/announcement.json`)) as any)
        let emb = new MessageEmbed()
            .setTitle(ann.title)
            .setColor(ann.color)
            .setAuthor(interaction.user.tag, `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png `)
        if (ann.description?.length > 0) emb.setDescription(ann.description)
        if (ann.footer?.length > 0) emb.setFooter(ann.footer)
        for (const field of ann.fields)
            emb.addField(field.title, field.value)
        interaction.update({ embeds: [emb], components: [] })
    }
}