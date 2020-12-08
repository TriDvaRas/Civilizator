
const welcome = require(`../assets/welcome`);
const DB = require(`./db`);
const logger = require(`../logger`);

function createBaseChannel(guild, role, options) {
    return new Promise(function (resolve, reject) {
        getConfig(guild).then(config => {
            let oldCh = guild.channels.cache.find(channel => channel.id === config.channelId);
            if (oldCh && !options.ignoreOld) {
                reject(`Channel already exists (${oldCh})`);
                return;
            }

            if (!role)
                role = guild.roles.cache.find(role => role.id === config.roleId);
            guild.channels.create("Civilizator", {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: role.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                    {
                        id: guild.members.cache.find(member => member.user.id == 719933714423087135).user,
                        allow: ['VIEW_CHANNEL'],
                    },
                ]
            }).then(channel => {
                if (!options.message) {
                    channel.send(welcome).then(msg => {
                        msg.pin()
                            .catch(err => { throw new Error(`pin [${channel.guild.name}] [${channel.name}] \n${err}`) })
                    })
                        .catch(err => { throw new Error(`send [${channel.guild.name}] [${channel.name}] \n${err}`) })
                    channel.send(`Created role \`${role.name}\` and bound bot role to it ✅`)
                        .catch(err => { throw new Error(`send [${channel.guild.name}] [${channel.name}] \n${err}`) })
                }
                channel.send(`Bound bot channel to ${channel} ✅`)
                    .catch(err => { throw new Error(`send [${channel.guild.name}] [${channel.name}] \n${err}`) })
                setConfig(guild, { channelId: channel.id });
                resolve(channel);
            })
                .catch(err => { throw new Error(`createChannel [${guild.name}] \n${err}`) })

        },
            err => reject(err)
        );


    });
}

function createBaseRole(guild, ignoreOld) {
    return new Promise(function (resolve, reject) {
        getConfig(guild).then(config => {
            let oldRole = guild.roles.cache.find(role => role.id === config.roleId);
            if (oldRole && !ignoreOld) {
                return reject(`Role already exists (\`${oldRole.name}\`)`);
            }
            guild.roles.create({
                data: {
                    name: "Civilized",
                    mentionable: true,
                    color: [64, 255, Math.floor(90 + Math.random() * 40)]
                }
            }).then(role => {
                guild.members.cache.find(member => member.user.id == globalThis.discordClient.user.id).roles.add(role).catch(err => { throw new Error(`addSelfRole [${guild.name}] \n${err}`) });
                setConfig(guild, { roleId: role.id });
                resolve(role);
            });

        },
            err => reject(err)
        ).catch(err => { throw new Error(`createRole [${guild.name}] \n${err}`) })
    });
}
function createBase(guild) {
    return new Promise((resolve, reject) => {
        createBaseRole(guild, true).then(role => {
            createBaseChannel(guild, role, { ignoreOld: true }).then(channel => {
                setConfig(guild, { roleId: role.id, channelId: channel.id })
                resolve()
            },
                err => reject(err)
            );
        },
            err => reject(err)
        );
    })
}

module.exports = {
    createBase,
    createBaseChannel,
    createBaseRole
}

function getConfig(guild) {
    return new Promise((resolve, reject) => {
        DB.getCollection(`guilds`).then(coll => {
            coll.findOne({ guildId: guild.id }, function (err, config) {
                if (err)
                    return reject(err);
                resolve(config);
            })

        })
    });
}
function setConfig(guild, newConfig) {
    return new Promise((resolve, reject) => {
        DB.getCollection(`guilds`).then(coll => {
            coll.findOne({ guildId: guild.id }, function (err, oldConfig) {
                if (err)
                    return reject(err);
                resolve();
                for (const key in newConfig) {
                    if (newConfig.hasOwnProperty(key)) {
                        if (newConfig[key] === oldConfig[key])
                            delete newConfig[key];
                    }
                }
                if (newConfig != {})
                    coll.updateOne({ guildId: guild.id }, { $set: newConfig }, function (err, res) {
                        if (err)
                            return reject(err);
                        resolve()
                        logger.log(`db`, `set config setup`);
                    })
            })

        })
    });
}