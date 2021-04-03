
/* global process activeGames discordClient botOwnerId*/
const Discord = require('discord.js');
const fs = require(`fs`)
const db = require(`../functions/db`)
module.exports = {
    name: 'announce',
    description: `announce(bot owner only) (you shouldn't see this btw)`,
    ignore: true,
    usage: '`announce`',
    execute: function execute(message, args, guildConfig) {
        if (message.author.id == botOwnerId) {
            try {
                let ann = JSON.parse(fs.readFileSync(`./assets/announcement.json`))
                let emb = new Discord.MessageEmbed()
                    .setTitle(ann.title)
                    .setColor(ann.color)
                    .setAuthor(message.author.tag, `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png `)
                if (ann.description)
                    emb.setDescription(ann.description)
                for (const field of ann.fields)
                    emb.addField(field.title, field.value)

                message.channel.send(emb).then(msg => {
                    msg.react(`❌`)
                    msg.react(`👍`)
                    //set reaction filter
                    const collector = msg.createReactionCollector((reaction, user) => [`❌`, `👍`].includes(reaction.emoji.name) && user.id == botOwnerId);
                    collector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name === '❌') {
                            msg.channel.send(`Aborted`);
                            collector.stop(`Aborted`);
                        }
                        else if (reaction.emoji.name === '👍') {
                            collector.stop(`Aborted`);
                            db.getAnnounceGuilds().then(async guilds => {
                                guilds = guilds.filter(x => `${x.channel}`.length == 18 && !ann.ignoreGuilds.includes(x.id))
                                msg.channel.send(`Sending message to ${guilds.length} guilds...`);
                                for (const g of guilds) {
                                    await discordClient.guilds.fetch(g.id)
                                        .then(guild => guild.channels.cache.get(g.channel).send(emb))
                                        .then(m => { g.succ = m.id })
                                        .catch(err => { g.err = err.message })
                                }
                                msg.channel.send(`Sent ${guilds.filter(x => x.succ).length}/${guilds.length} messages`);
                                fs.writeFileSync(`./assets/announceResults.txt`, guilds.map(x => x.succ ? `${x.id} Succ ${x.succ}` : `${x.id} ${x.err}`).join(`\n`))
                            })
                        }
                    });
                    collector.on('end', (collected, reason) => {
                        msg.reactions.removeAll();
                    });
                })
            }
            catch (error) {
                message.channel.send(`${error.message}`)
            }

        }
    },
};