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

export function getAboutMessageEmbeds(about: any) {
    let emb = new MessageEmbed()
        .setTitle(about.title)
        .setColor(about.color)
    if (about.description?.length > 0)
        emb.setDescription(about.description);
    if (about.footer?.length > 0)
        emb.setFooter(about.footer);
    for (const field of about.fields)
        emb.addField(field.title, field.value);
    return [emb];
}