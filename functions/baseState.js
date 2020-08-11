const IO = require('./IO.js');

module.exports = function (game) {
    switch (game.toLowerCase()) {
        case "civ5":
            return IO.Read(`./assets/BaseStates/civ5.json`)
        case "lek":
            return IO.Read(`./assets/BaseStates/civ5lek.json`)


        default:
            return IO.Read(`./assets/BaseStates/civ5.json`)
    }
}