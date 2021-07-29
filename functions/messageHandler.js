/* global logger chalk discordClient process*/
//imports
const Discord = require('discord.js');
const db = require(`./db`)
//Set logger

module.exports = message => {
    try {
        if (message.author.id == discordClient.user.id)
            logger.log(`self`, `[${message.guild.id}] [${message.channel.id}] ${message.cleanContent}`)
    }
    catch (err) {
        logger.log(`self`, `ops ${err.message}, ${err.stack}`);
    }
    if (message.author.bot)
        return;
    if (message.guild === null)
        execDMCommand(message)
    else
        execCommand(message)
}

function execCommand(message) {
    db.getGuildConfig(message.guild.id)
        .then(
            cfg => {
                //check if server has no config
                if (!cfg)
                    if (message.content.startsWith(`!`) || message.content.startsWith(`<@!${discordClient.user.id}>`))
                        return message.channel.send(`Failed command execution. Your server has no config.\nThis was probably caused by bot being offline then you added it to your server.\nThe easiest way to fix this is to kick and reinvite the bot to your server(if it's still broken try again later)\n `)
                    else return
                const { prefix } = cfg;
                if (isStatsMention(message, cfg)) return
                let [args, command] = parseArgs(message, prefix)
                if (discordClient.commands.has(command))
                    execNormalCommand(message, args, command, cfg)
                else if (discordClient.civcommands.has(command))
                    execCivCommand(message, args, command, cfg)
            },
            err => logger.log(`error`, `${err}`)
        );
}

function execDMCommand(message) {
    if (message.content.startsWith(`!`)) {
        let [args, command] = parseArgs(message, `!`)
        let cmd = discordClient.commands.get(command) || discordClient.civcommands.get(command)
        if (cmd) {
            logger.log(`cmd`, `[${chalk.magentaBright(`DM`)}] [${chalk.magentaBright(message.author.tag)}] ${chalk.bold.rgb(255, 87, 20)(command)} ${chalk.bold.yellowBright(args.join(` `))}`);
            if (cmd.allowDM) {
                cmd.execute(message, args, null, true)
            }
            else
                message.channel.send(`You can't use this command here.\n Allowed commands are: ${discordClient.commands.filter(x => x.allowDM && !x.ignore).map(x => `\`!${x.name}\``).join(` `)}`)
        }
        else
            message.channel.send(`Unknown command. Try \`!help\`. If you want to submit feedback remove \`!\` at the start of the message`)
    }
    else {
        let guild = globalThis.logGuild;
        if (!guild)
            return
        guild.channels.cache.find(channel => channel.name == `feed`).send(`**FEED**
\t\t\tFrom: ${message.author} (${message.author.tag})
\t\t\tText: ${message.toString()}
\t\t\tAttachments: ${message.attachments.array().map(x => `${x.name}\n${x.url}`).join(`,\n`)}`
        ).then(() => {
            message.channel.send(`Your message was successfully submited 👍`)
        })
    }
}

function isStatsMention(message, cfg) {
    if (message.content == `<@!${discordClient.user.id}>` || message.content == `<@${discordClient.user.id}>`) {
        message.channel.send(new Discord.MessageEmbed()
            .setTitle(`Bot Settings`)
            .setColor('#46a832')
            .addField(`Server`, message.guild.name, false)
            .addField(`Prefix`, cfg.prefix, true)
            .addField(`Allow Getrole`, cfg.allowGetrole ? `Yes` : `No`, true)
            .addField(`News`, cfg.news ? `Yes` : `No`, true)
            .addField(`Role`, `<@&${cfg.roleId}>`, true)
            .addField(`Channel`, `<#${cfg.channelId}>`, true)
            .addField(`Normal Games`, cfg.gameCount, false)
            .addField(`Fast Games`, cfg.fastCount, true)
            .setFooter('Created by TriDvaRas#4805', 'https://tdr.s-ul.eu/hP8HuUCR')
        )
        return true
    }

}

function parseArgs(message, prefix) {
    // eslint-disable-next-line init-declarations
    let args, command;
    if (message.content.startsWith(prefix)) {
        args = message.content.slice(prefix.length).split(/ +/u);
        command = args.shift().toLowerCase();
    }
    else if (message.content.startsWith(`<@!${discordClient.user.id}>` || message.content.startsWith(`<@${discordClient.user.id}>`))) {
        args = message.content.replace(new RegExp(`<@!?${discordClient.user.id}> *`, `gu`), ``).split(/ +/u);
        command = args.shift().toLowerCase();
    }
    return [args, command]
}

function execNormalCommand(message, args, command, cfg) {
    try {
        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${chalk.bold.rgb(255, 87, 20)(command)} ${chalk.bold.yellowBright(args.join(` `))}`);
        if (args[0] == "help") {
            message.channel.send(`${discordClient.commands.get(command).description}\nUsage:\n${discordClient.commands.get(command).usage}\n${discordClient.commands.get(command).example ? `Example:\n ${discordClient.commands.get(command).example}` : ""}`)
                .then(msg => {
                    message.delete({ timeout: 30000 });
                    msg.delete({ timeout: 30000 })
                })
        }
        else
            discordClient.commands.get(command).execute(message, args, cfg);
    }
    catch (error) {
        logger.log('error', `[${chalk.magentaBright(message.guild.name)}] ${error}`)
    }
}
function execCivCommand(message, args, command, cfg) {
    try {
        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] ${chalk.bold.rgb(255, 87, 20)(command)} ${chalk.bold.yellowBright(args.join(` `))}`);
        if (args[0] == "help") {
            message.channel.send(`${discordClient.civcommands.get(command).description}\nUsage:\n${discordClient.civcommands.get(command).usage}\n${discordClient.civcommands.get(command).example ? `Example:\ndiscordClient.civcommands.get(command).example` : ""}`)
                .then(msg => {
                    message.delete({ timeout: 30000 });
                    msg.delete({ timeout: 30000 })
                })
        }
        else if (cfg.channelId == message.channel.id || process.argv.includes(`test`))
            discordClient.civcommands.get(command).execute(message, args, cfg);
        else {
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] bad channel`);
            message.channel.send(`Randomizer-related commands only work in set channel. You can check current channel and role settings by mentioning bot.`)
        }
    }
    catch (error) {
        logger.log('error', `[${chalk.magentaBright(message.guild.name)}] ${error}`)
    }
}