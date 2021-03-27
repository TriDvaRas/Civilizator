/* global logger chalk discordClient logGuild*/
const Setup = require('./Setup.js');
const welcome = require(`../assets/welcome`);
const db = require(`./db`);


function initGuildEvents() {
    discordClient.on('guildCreate', guild => {
        if (global.logGuild)
            global.logGuild.channels.cache.find(channel => channel.name == `guilds-log`).send(`Joined guild [${guild.id}] [${guild.name}]\n guildCount: ${discordClient.guilds.cache.size}`)
        logger.log(`info`, `[${chalk.magentaBright(guild.name)}] joined guild `);
        db.getGuildConfig(guild.id).then(
            config => {
                if (config) {
                    if (config.configured) {
                        let role = guild.roles.cache.get(config.roleId)
                        let channel = guild.channels.cache.get(config.channelId)
                        repairChannelRole(guild, role, channel, config)
                    }
                    else
                        createConfig(guild, true)
                }
                else
                    createConfig(guild)

            }
        )
    })
    discordClient.on('guildDelete', guild => {
        if (logGuild)
            logGuild.channels.cache.find(channel => channel.name == `guilds-log`).send(`Left guild [${guild.id}] [${guild.name}] \n guildCount: ${discordClient.guilds.cache.size}`)
        logger.log(`info`, `[${chalk.magentaBright(guild.name)}] left guild `);
        db.updateGuildConfig(guild.id, null, { kicked: true })

    })
}

function repairChannelRole(guild, role, channel, config) {
    if (role && channel) {
        createConfig(guild, true, `I'm Reborn <:atashi:825376537724977192> <:coal:825376671481331753> <:saiseisan:825376560156246056>\n**Found old Channel and Role**❗\n If you want to use old channel use \`lockchannel\` command there(after giving the bot permission to read that channel)\n Old role can't be used so you can delete it if you want(new Role should be the lowest in roles list)`)
    }
    else if (role && !channel) {
        createConfig(guild, true,`I'm Reborn <:atashi:825376537724977192> <:coal:825376671481331753> <:saiseisan:825376560156246056>\n**Found old Role**❗\n It can't be used so you can delete it if you want(new Role should be the lowest in roles list)`)
    }
    else if (!role && channel) {
        createConfig(guild, true, `I'm Reborn <:atashi:825376537724977192> <:coal:825376671481331753> <:saiseisan:825376560156246056>\n**Found old Channel**❗\n If you want to use it use \`lockchannel\` command there(after giving the bot permission to read that channel)`)
    }
    else
        createConfig(guild, true, `I'm Reborn <:atashi:825376537724977192> <:coal:825376671481331753> <:saiseisan:825376560156246056>`)
}

function createConfig(guild, repair, tip) {
    if (repair)
        db.getGuildConfig(guild.id)
            .then(config => Setup.createRole(guild, config, true)
                .then(role => Setup.createChannel(guild, config, role, true)
                    .then(channel => {
                        channel.send(`Created channel ${channel} ✅\nCreated role ${role} ✅\nBound bot role to ${role} ✅\nBound bot channel to ${channel} ✅`)
                        if (tip)
                            channel.send(tip)
                        channel.send(welcome).then(msg => {
                            msg.pin()
                        })
                        db.updateGuildConfig(guild.id, config, { roleId: role.id, channelId: channel.id, configured: true, kicked: false })
                    })))
    else
        db.createGuildConfig(guild)
            .then(config => Setup.createRole(guild, config, true)
                .then(role => Setup.createChannel(guild, config, role, true)
                    .then(channel => {
                        channel.send(`Created channel ${channel} ✅\nCreated role ${role} ✅\nBound bot role to ${role} ✅\nBound bot channel to ${channel} ✅`)
                        channel.send(welcome).then(msg => {
                            msg.pin()
                        })
                        db.updateGuildConfig(guild.id, config, { roleId: role.id, channelId: channel.id, configured: true })
                    })))

}

module.exports = {
    initGuildEvents,
}