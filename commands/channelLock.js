//imports
var FF = require('../assets/functions/IO.js');
var Perm = require('../assets/functions/PermissionsFunctions.js');
module.exports = {
    name: 'channelLock',
    description: 'ChannelLock for !civ commands (Admin)',
    usage: `\`!civ channelLock [enable/disable]\` - enable/disable channelLock on this Server\n` +
        `\`!civ channelLock [w/b]\` - whitelist/blacklist this channel`,
    execute: async function (message, args) {
        if (!Perm.checkRoles(message, "skip", true, false, false)) {
            message.reply("ахуел?(Admin only)");
            return;
        }
        cfg = FF.Read('./commands/CivRandomizer/config.json');
        if (args[0] == "whitelist"||args[0] == "white"||args[0] == "w") {
            if (!channelIsWhite(message.channel, cfg)) {
                cfg.channelWhiteIds.push(`${message.channel.id}`);
                message.channel.send(`${message.author} whitelisted this channel`);
            }
        } else if (args[0] == "blacklist"||args[0] == "black"||args[0] == "b") {
            if (channelIsWhite(message.channel, cfg)) {
                RemoveItem(cfg.channelWhiteIds, `${message.channel.id}`);
                message.channel.send(`${message.author} blacklisted this channel`);
            }
        } else if (args[0] == "enable") {
            if (!guildIsLocked(message.guild, cfg)) {
                cfg.channelLockGuildsIds.push(`${message.guild.id}`);
                message.channel.send(`${message.author} enabled channel lock on this server`);
            }
        } else if (args[0] == "disable") {
            if (guildIsLocked(message.guild, cfg)) {
                RemoveItem(cfg.channelLockGuildsIds, `${message.guild.id}`);
                message.channel.send(`${message.author} disabled channel lock on this server`);
            }
        }





        FF.Write('./commands/CivRandomizer/config.json', cfg);

    },
};
function guildIsLocked(guild, cfg) {
    return cfg.channelLockGuildsIds.includes(`${guild.id}`);
}
function channelIsWhite(channel, cfg) {
    return cfg.channelWhiteIds.includes(`${channel.id}`);
}
function RemoveItem(array, item) {
    array.splice(array.indexOf(item), 1);
}