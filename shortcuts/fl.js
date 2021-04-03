let fast = require(`../civcommands/fast`)
module.exports = {
    name: `fl`,
    description: `Short for \`fast lek\``,
    execute: function execute(message, args, guildConfig) {
        fast.execute(message, ['lek', ...args], guildConfig)
    },
};