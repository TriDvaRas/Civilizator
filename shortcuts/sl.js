let start = require(`../civcommands/start`)
module.exports = {
    name: `sl`,
    description: `Short for \`start lek\``,
    execute: function execute(message, args, guildConfig) {
        start.execute(message, ['lek', ...args], guildConfig)
    },
};