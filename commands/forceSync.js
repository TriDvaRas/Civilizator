const db = require("../functions/db");

module.exports = {
    name: 'fcs',
    description: `fcs(bot owner only) (you shouldn't see this btw, pls send smth like \`i can see fcs\` here)`,
    ignore: true,
    usage: '`forceSync`',
    execute: async function (message, args) {
        if (message.author.id == 272084627794034688){
            db.getUnsynced().then(succ => {message.reply(`suc\n${succ}`)},() => {message.reply(`err`)})
            message.reply(`started fcs`)
            
        }
    },
};