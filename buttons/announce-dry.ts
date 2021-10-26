import { ButtonInteraction, MessageEmbed, TextChannel } from "discord.js";
import * as fs from 'fs';
import path from 'path';
import api from "../api/api";
import { IGuild } from "../types/api";

export default {
    customId: 'announce-dry',
    execute: async (interaction: ButtonInteraction, args: string[]) => {
        let guilds: IGuild[] = await api.get(`/guilds`)
        const channels: {
            guild: IGuild,
            channelId: string,
            channel: TextChannel | null,
            channelType: string,
            result?: boolean,
        }[] = []
        const notFound: IGuild[] = []
        for (const g of guilds) {
            const guild = await client.guilds.fetch(g.id)
            if (!g.news) continue
            if (g.newsChannels.length > 0)
                for (const c of g.newsChannels) {
                    channels.push({
                        guild: g,
                        channelId: c,
                        channel: await guild.channels.fetch(c) as TextChannel | null,
                        channelType: `news`
                    })
                }
            else {
                const channelId = (await api.get(`/guild/${g.id}/lastchannelid`))?.id
                
                if (channelId)
                    try {
                        channels.push({
                            guild: g,
                            channelId: channelId,
                            channel: await guild.channels.fetch(channelId) as TextChannel | null,
                            channelType: `last`
                        })
                    } catch (error) {
                        log.warn(`Dry run Error [${g.id}] [${channelId}] ${error}`);
                        notFound.push(g)
                    }
                else
                    notFound.push(g)
            }
        }
        
        //todo log
        let ann = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../assets/json/announcement.json`)) as any)
        let emb = new MessageEmbed()
            .setTitle(ann.title)
            .setColor(ann.color)
            .setAuthor(interaction.user.tag, `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png `)
        if (ann.description?.length > 0) emb.setDescription(ann.description)
        if (ann.footer?.length > 0) emb.setFooter(ann.footer)
        for (const field of ann.fields)
            emb.addField(field.title, field.value)
        interaction.update({ embeds: [emb] })
        const message = `${guilds.map(g => `[${g.id}] ${g.name}\n${(channels.filter(c => c.guild.id === g.id)
            .map(x => `\t\u200B\t\u200B[${x.channelId}] ${x.channelType}`).join(`\n`)||'--')}`).join(`\n`)}`

        log.info(`ANNOUNCE (DRY)\n${message}`)
        interaction.followUp({ content: `DRY RUN\n${message}`, ephemeral: true })
    }
}