import { CommandInteraction, MessageEmbed, User } from "discord.js";
import { getAnnounceButtons } from "../managers/buttonManager";

export function getAnnounceMessageEmbeds(ann: any, author: User) {
    let emb = new MessageEmbed()
        .setTitle(ann.title)
        .setColor(ann.color)
        .setAuthor(author.tag, `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png `);
    if (ann.description?.length > 0)
        emb.setDescription(ann.description);
    if (ann.footer?.length > 0)
        emb.setFooter(ann.footer);
    for (const field of ann.fields)
        emb.addField(field.title, field.value);
    return [emb];
}