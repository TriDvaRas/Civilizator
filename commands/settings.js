/* global logger chalk localeCodes*/
const Perm = require('../functions/Permissions.js');
const { installConfig } = require(`../functions/guildConfig`);
const db = require(`../functions/db`)
const setup = require(`../functions/Setup`);
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'settings',
    description: `Change bot's settings (Admin)`,
    usage: `\`setting reset\` - simulates re-inviting the bot, use if role/channel broke
\`settings prefix <new prefix>\` - changes bot's prefix 
\`settings getrole <yes/no>\` - enables/disables \`getrole\` command 
\`settings lang list\` - shows list of available languages 
\`settings lang <add/remove> <2 character language code>\` - enables/disables language (for ban aliases) 
\`settings channel <set/create>\` - **set** bot to current channel or **create** a new one and bind to it 
\`settings role create\` - creates a new role and binds bot to it
\`settings news <yes/no>\` - enables/disables receiving messages about major bot updates
`,
    execute: function execute(message, args, guildConfig) {
        if (Perm.checkRoles(guildConfig, message.member, null, { admin: true })) {
            if (args.length < 2 && args[0] != `reset`) return message.reply(`Wrong arguments. Try \`${this.name} help\``).then(msg => msg.delete({ timeout: 10000 }))
            switch (args.shift()) {
                case `reset`:
                    message.channel.send(`Restoring default settings...`)
                    installConfig(message.guild)
                    break;
                case `prefix`:
                    setPrefix(this, message, args, guildConfig)
                    break;
                case `getrole`:
                    updateGetrole(this, message, args, guildConfig)
                    break;
                case `lang`:
                    updateLang(message, args, guildConfig)
                    break;
                case `channel`:
                    if (args[0] == `set`)
                        setChannel(this, message, args, guildConfig)
                    else if (args[0] == `create`)
                        createChannel(this, message, args, guildConfig)
                    else {
                        message.delete({ timeout: 10000 })
                        message.reply(`Wrong arguments. Try \`${this.name} help\``).then(msg => msg.delete({ timeout: 10000 }))
                    }
                    break;
                case `role`:
                    if (args[0] == `create`)
                        createRole(this, message, args, guildConfig)
                    else {
                        message.delete({ timeout: 10000 })
                        message.reply(`Wrong arguments. Try \`${this.name} help\``).then(msg => msg.delete({ timeout: 10000 }))
                    }
                    break;
                case `news`:
                    updateAnounce(this, message, args, guildConfig)//TODO
                    break;
                default:
                    message.delete({ timeout: 10000 })
                    message.reply(`Wrong arguments. Try \`${this.name} help\``).then(msg => msg.delete({ timeout: 10000 }))
                    break;
            }
        }
        else {
            message.delete({ timeout: 10000 })
            message.reply("Only users with server administrator privileges can use this command").then(msg => msg.delete({ timeout: 10000 }))
        }

    },
};

function createChannel(command, message, args, guildConfig) {
    setup.createChannel(message.guild, guildConfig)
        .then(
            channel => {
                message.channel.send(`Successfuly created ${channel}`)
                db.updateGuildConfig(message.guild.id, guildConfig, { channelId: channel.id })
                channel.send(`Bound bot to ${channel} ✅`)
            },
            err => {
                message.channel.send(`Failed creating channel: \`${err.message}\``)
            }
        );
}

function setChannel(command, message, args, guildConfig) {
    db.updateGuildConfig(message.guild.id, guildConfig, { channelId: message.channel.id })
    message.channel.send(`Bound bot to ${message.channel} ✅`)
}

function setPrefix(command, message, args, guildConfig) {
    logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] changing prefix`)
    db.updateGuildConfig(message.guild.id, guildConfig, { prefix: args[0] })
    message.channel.send(`Changed prefix to \`${args[0]}\``)
    logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] changed prefix to ${args[0]}`)
}

function createRole(command, message, args, guildConfig) {
    setup.createRole(message.guild, guildConfig)
        .then(
            role => {
                message.channel.send(`Successfuly created ${role}`)
                db.updateGuildConfig(message.guild.id, guildConfig, { roleId: role.id })
                message.channel.send(`Bound bot to ${role} ✅`)
            },
            err => {
                message.channel.send(`Failed creating role: \`${err.message}\``)
            }
        );
}

function updateLang(message, args, guildConfig) {
    let locs = guildConfig.locales.match(/.{2}/gu)
    let loc = args[1]?.toLowerCase()
    switch (args[0]) {
        case `l`:
        case `list`:
            message.channel.send(new MessageEmbed()
                .setTitle(`Alias Languages`)
                .setDescription(`Note: \`en\` can't be disabled`)
                .setColor('#46a832')
                .addField(`Enabled`, `${locs.map(x => `\`${x}\``).join(`\n`)}\u200B\n`, true)
                .addField(`Disabled`, `${localeCodes.filter(x => !locs.includes(x)).map(x => `\`${x}\``).join(`\n`)}\u200B\n`, true)
                .setFooter('Created by TriDvaRas#4805', 'https://tdr.s-ul.eu/hP8HuUCR'))
            break;
        case `a`:
        case `add`:
            if (locs.includes(loc))
                message.channel.send(`\`${loc}\` is already enabled`)
            else if (localeCodes.includes(loc) && loc != `en`) {
                db.updateGuildConfig(message.guild.id, guildConfig, { locale: [...locs, loc].join(``) })
                message.channel.send(`Enabled \`${loc}\``)
            }
            else {
                message.delete({ timeout: 10000 })
                message.reply(`Wrong arguments. Try \`${module.exports.name} help\``).then(msg => msg.delete({ timeout: 10000 }))
            }
            break;
        case `r`:
        case `rem`:
        case `remove`:
            if (loc == `en`)
                message.channel.send(`Can't disable \`en\``)
            else if (!locs.includes(loc))
                message.channel.send(`\`${loc}\` is already disabled`)
            else if (localeCodes.includes(loc)) {
                db.updateGuildConfig(message.guild.id, guildConfig, { locale: locs.filter(x => x != loc).join(``) })
                message.channel.send(`Disabled \`${loc}\``)
            }
            else {
                message.delete({ timeout: 10000 })
                message.reply(`Wrong arguments. Try \`${module.exports.name} help\``).then(msg => msg.delete({ timeout: 10000 }))
            }
            break;
        default:
            message.delete({ timeout: 10000 })
            message.reply(`Wrong arguments. Try \`${module.exports.name} help\``).then(msg => msg.delete({ timeout: 10000 }))
            break;
    }

}

function updateAnounce(command, message, args, guildConfig) {
    switch (args[0]) {
        case `+`:
        case `y`:
        case `yes`:
        case `allow`:
        case `enable`:
            db.updateGuildConfig(message.guild.id, guildConfig, { news: true })
            message.channel.send(`Enabled news`)
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] Enabled news`);
            break;
        case `-`:
        case `n`:
        case `no`:
        case `disallow`:
        case `disable`:
            db.updateGuildConfig(message.guild.id, guildConfig, { news: false })
            message.channel.send(`Disabled news`)
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] disabled news`);
            break;

        default:
            message.delete({ timeout: 10000 })
            message.reply(`Wrong arguments. Try \`${this.name} help\``).then(msg => msg.delete({ timeout: 10000 }))
            break;
    }
}
function updateGetrole(command, message, args, guildConfig) {
    switch (args[0]) {
        case `+`:
        case `y`:
        case `yes`:
        case `allow`:
            if (guildConfig.allowGetrole == true)
                return message.channel.send(`\`getrole\` is already enabled`)
                    .then(msg => msg.delete({ timeout: 10000 }))
            db.updateGuildConfig(message.guild.id, guildConfig, { allowGetrole: true })
            message.channel.send(`Enabled \`getrole\``)
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] Enabled getrole`);
            break;
        case `-`:
        case `n`:
        case `no`:
        case `disallow`:
            if (guildConfig.allowGetrole == false)
                return message.channel.send(`\`getrole\` is already disabled`)
                    .then(msg => msg.delete({ timeout: 10000 }))
            db.updateGuildConfig(message.guild.id, guildConfig, { allowGetrole: false })
            message.channel.send(`Disabled \`getrole\``)
            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] disabled getrole`);
            break;

        default:
            message.reply(`Wrong arguments. Try \`${command.name} help\``).then(msg => msg.delete({ timeout: 10000 }))
            break;
    }

}