//imports
const Discord = require('discord.js');
const GC = require("../functions/guildConfig.js");
//Set logger

module.exports = function (message) {
    if (message.author.bot)
        return;
    if (message.guild == null) {
        let guild = globalThis.logGuild;
        if (!guild)
            return
        guild.channels.cache.find(channel => channel.name == `feed`).send(`**FEED**
			From: ${message.author} (${message.author.tag})
			Text: ${message.toString()}
			Attachments: ${message.attachments.array().map(x => `${x.name}\n${x.url}`).join(`,\n`)}`
        )
            .then(() => {
                message.channel.send(`Your message was successfully submited 👍`)
                    .catch(err => logger.log(`error`, `[DM] [${chalk.magentaBright(message.author.tag)}] ${err}`))
            })
            .catch(err => logger.log(`error`, `[DM] [${chalk.magentaBright(message.author.tag)}] ${err}`))
        return
    }



    GC.getConfig(message.guild)
        .then(cfg => {
            //check if server has no config
            if (!cfg)
                if (message.content.startsWith(`!`) || message.content.startsWith(`<@!${discordClient.user.id}>`))
                    return message.channel.send(`Failed command execution. Your server has no config.\nThis was probably caused by bot being offline then you added it to your server.\nThe easiest way to fix this is to kick and readd the bot to your server.`)
                        .catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                else
                    return;
            //exec
            let args, command;

            const { prefix } = cfg;
            if (message.content.startsWith(prefix)) {
                args = message.content.slice(prefix.length).split(/ +/);
                command = args.shift().toLowerCase();
            }
            else if (message.content == `<@!${discordClient.user.id}>` || message.content == `<@${discordClient.user.id}>`) {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`Bot Settings`)
                    .setColor('#46a832')
                    .addField(`Server`, message.guild.name, false)
                    .addField(`Prefix`, prefix, true)
                    .addField(`Role`, `<@&${cfg.roleId}>`, true)
                    .addField(`Channel`, `<#${cfg.channelId}>`, true)
                    .addField(`Normal Games Count`, cfg.gameCount, false)
                    .addField(`Fast Games Count`, cfg.fastCount, true)
                    .setTimestamp()
                    .setFooter('Created by TriDvaRas', 'https://tdr.s-ul.eu/hP8HuUCR')
                ).catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
            }
            else if (message.content.startsWith(`<@!${discordClient.user.id}>`) || message.content.startsWith(`<@${discordClient.user.id}>`)) {
                args = message.content.split(/ +/);
                args.shift();
                command = args.shift().toLowerCase();
            }
            else
                return;
            //exit if command doesn't exist
            if (discordClient.commands.has(command))
                //execute command		
                try {
                    logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${chalk.bold.rgb(255, 87, 20)(command)} ${chalk.bold.yellowBright(args.join(` `))}`);
                    if (args[0] == "help") {
                        message.channel.send(`${discordClient.commands.get(command).description}\nUsage:\n${discordClient.commands.get(command).usage}\n${discordClient.commands.get(command).example ? 'Example:\n' + discordClient.commands.get(command).example : ""}`)
                            .then(msg => { message.delete({ timeout: 30000 }); msg.delete({ timeout: 30000 }) })
                            .catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                    } else
                        discordClient.commands.get(command).execute(message, args);
                } catch (error) {
                    logger.log('error', `[${chalk.magentaBright(message.guild.name)}] ${error}`)
                }
            else if (discordClient.civcommands.has(command))
                try {
                    logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${chalk.bold.rgb(255, 87, 20)(command)} ${chalk.bold.yellowBright(args.join(` `))}`);
                    if (args[0] == "help") {
                        message.channel.send(`${discordClient.civcommands.get(command).description}\nUsage:\n${discordClient.civcommands.get(command).usage}\n${discordClient.civcommands.get(command).example ? 'Example:\n' + discordClient.civcommands.get(command).example : ""}`)
                            .then(msg => { message.delete({ timeout: 30000 }); msg.delete({ timeout: 30000 }) })
                            .catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                    } else if (cfg.channelId == message.channel.id || process.argv.includes(`test`))
                        discordClient.civcommands.get(command).execute(message, args);
                    else {
                        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] bad channel`);
                        message.channel.send(`Randomizer-related commands only work in set channel. You can check current channel and role settings by mentioning bot.`)
                            .catch(err => logger.log(`error`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${err}`))
                    }
                } catch (error) {
                    logger.log('error', `[${chalk.magentaBright(message.guild.name)}] ${error}`)
                }
        },
            err =>
                logger.log(`error`, `${err}`)
        );
} 