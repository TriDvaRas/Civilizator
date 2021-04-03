let ban = require(`../civcommands/ban`)
module.exports = {
    name: `b`,
    description: `Short for \`ban\``,
    execute: function execute(message, args, guildConfig) {
        ban.execute(message, args, guildConfig)
    },
};