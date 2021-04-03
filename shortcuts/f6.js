let fast = require(`../civcommands/fast`)
module.exports = {
    name: `f6`,
    description: `Short for \`fast civ6\``,
    execute: function execute(message, args, guildConfig) {
        fast.execute(message, ['civ6', ...args], guildConfig)
    },
};