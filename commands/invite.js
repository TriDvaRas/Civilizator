/*global discordClient*/
module.exports = {
    name: 'invite',
    description: 'Get bot invite link',
    allowDM: true,
    usage: '`invite`',
    execute: function execute(message, args, guildConfig, isDM) {
        discordClient.generateInvite({
            permissions: [
                'MANAGE_ROLES',
                'MANAGE_CHANNELS',
                'VIEW_CHANNEL',
                'SEND_MESSAGES',
                'MANAGE_MESSAGES',
                'EMBED_LINKS',
                'ATTACH_FILES',
                'ADD_REACTIONS'
            ]
        }).then(link => {
            message.channel.send(link)
        })

    },
};