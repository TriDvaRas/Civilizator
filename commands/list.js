
var Perm = require('../assets/functions/PermissionsFunctions.js');
module.exports = {
    name: 'list',
    description: 'Gives a link to civlist Spreadsheet',
    usage: '`!civ list`',
    execute:async function(message, args) {
        if (!Perm.checkRoles(message,  0, false, false, true)) {
            message.reply("ахуел?(CivRole only)");
            return;
        }
        message.channel.send("https://docs.google.com/spreadsheets/d/19xww9IQSxxHHhcdgta2aQh0-j74S6XFQ-sODytAjWdg/edit?usp=sharing");
    },
};