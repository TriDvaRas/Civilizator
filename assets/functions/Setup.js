const IO = require('./IO.js');
const welcome = require(`../welcome`);
function createBaseChannel(guild, role, message) {
    return new Promise(function (resolve, reject) {
        let config = IO.Read(`guilds/${guild.id}/config.json`);
        let oldCh = guild.channels.cache.find(channel => channel.id === config.channelId);
        if (oldCh) {
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
            if (!message) {
                channel.send(welcome).then(msg => {
                    msg.pin();
                });
                channel.send(`Created role \`${role.name}\` and bound bot role to it ✅`);
            }
            channel.send(`Bound bot channel to ${channel} ✅`);
            config.channelId = channel.id;
            IO.Write(`guilds/${guild.id}/config.json`, config);
            resolve(channel);
        });
    });
}

function createBaseRole(guild, ignoreOld) {
    return new Promise(function (resolve, reject) {
        let config = IO.Read(`guilds/${guild.id}/config.json`);
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
            config.roleId = role.id;
            IO.Write(`guilds/${guild.id}/config.json`, config);
            resolve(role);
        });
    });
}
function createBase(guild) {
    return new Promise((resolve, reject) => {
        createBaseRole(guild, true).then(role => {
            createBaseChannel(guild, role).then(channel => {
                guild.members.cache.find(member => member.user.id == globalThis.discordClient.user.id).roles.add(role);
                resolve()
            }).catch(err => reject(err));
        }).catch(err => reject(err));
    })
}

module.exports = {
    createBase,
    createBaseChannel,
    createBaseRole
}