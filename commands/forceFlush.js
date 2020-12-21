const db = require("../functions/db");
module.exports = {
    name: 'fcf',
    description: `fcf(bot owner only) (you shouldn't see this btw, pls send smth like \`i can see fcs\` here)`,
    ignore: true,
    usage: '`fcf`',
    execute: async function (message, args) {
        if (message.author.id == 272084627794034688){
            RT.flushGames(true)
            message.reply(`started fcf`)
            
        }
    },
};