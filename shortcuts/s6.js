let start = require(`../civcommands/start`)
module.exports = {
    name: `s6`,
    description: `Short for \`start civ6\``,
    execute: function execute(message, args, guildConfig) {
        start.execute(message, ['civ6', ...args], guildConfig)
    },
};