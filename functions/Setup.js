/* global discordClient*/

function createChannel(guild, config, role, firstTime) {
    return new Promise((resolve, reject) => {
        if (!firstTime) {
            let oldCh = guild.channels.cache.get(config.channelId)
            if (oldCh) {
                reject(new Error(`Channel already exists (${oldCh})`));
                return;
            }
        }
        if (!role)
            role = guild.roles.cache.get(config.roleId);
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
                    id: guild.members.cache.get(discordClient.user.id).user,
                    allow: ['VIEW_CHANNEL'],
                },
            ]
        }).then(channel => {
            resolve(channel);
        }).catch(err => reject(err))
    });
}


function createRole(guild, config, firstTime) {
    return new Promise((resolve, reject) => {
        if (!firstTime) {
            let oldRole = guild.roles.cache.get(config.roleId);
            if (oldRole) {
                reject(new Error(`Role already exists (\`${oldRole.name}(${oldRole.id})\`)`));
                return
            }
        }
        guild.roles.create({
            data: {
                name: "Civilized",
                mentionable: true,
                color: [64, 255, Math.floor(90 + (Math.random() * 40))]
            }
        }).then(role => {
            guild.members.cache.get(discordClient.user.id).roles.add(role)
            resolve(role);
        }).catch(err => reject(err))
    });
}

module.exports = {
    createChannel,
    createRole
}