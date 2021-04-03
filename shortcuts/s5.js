let start = require(`../civcommands/start`)
module.exports = {
    name: `s5`,
    description: `Short for \`start civ5\``,
    execute: function execute(message, args, guildConfig) {
        start.execute(message, ['civ5', ...args], guildConfig)
    },
};