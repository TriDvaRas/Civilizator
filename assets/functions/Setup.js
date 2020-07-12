const IO = require('./IO.js');
const welcome=require(`../welcome`);
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
                channel.send(welcome).then(msg=>{
                    msg.pin();
                });
                channel.send(`Bound bot role to \`${role.name}\` ✅`);
            }
            channel.send(`Bound bot channel to ${channel} ✅`);
            config.channelId = channel.id;
            IO.Write(`guilds/${guild.id}/config.json`, config);
            resolve(channel);
        });
    });
}

function createBaseRole(guild) {
    return new Promise(function (resolve, reject) {
        let config = IO.Read(`guilds/${guild.id}/config.json`);
        let oldRole = guild.roles.cache.find(role => role.id === config.roleId);
        if (oldRole) {
            reject(`Role already exists (\`${oldRole.name}\`)`);
            return;
        }
        guild.roles.create({
            data: {
                name: "Civilized",
                mentionable: true,
                color: [64, 255, 159]
            }
        }).then(role => {
            config.roleId = role.id;
            IO.Write(`guilds/${guild.id}/config.json`, config);
            resolve(role);
        });
    });
}
function createBase(guild) {
    createBaseRole(guild).then(role => {
        createBaseChannel(guild, role).then(channel => {
            guild.members.cache.find(member => member.user.id == globalThis.client.user.id).roles.add(role);
            //TODO something
        })
    });
}

module.exports = {
    createBase,
    createBaseChannel,
    createBaseRole
}