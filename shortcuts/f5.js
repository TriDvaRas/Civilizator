let fast = require(`../civcommands/fast`)
module.exports = {
    name: `f5`,
    description: `Short for \`fast civ5\``,
    execute: function execute(message, args, guildConfig) {
        fast.execute(message, ['civ5', ...args], guildConfig)
    },
};