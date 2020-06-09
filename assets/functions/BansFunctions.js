
var Phaser = require('./PhasingFunctions.js');
module.exports = {
    CheckBanned(CurrState, C) {
        if (CurrState.banned.find(x => x == C.id)) {

            return true;
        }
        return false;
    },
    Ban(C, CurrState) {
        CurrState.bansActual = parseInt(CurrState.bansActual) + 1;
        CurrState.Civs.splice(CurrState.Civs.findIndex(x => x == C.id), 1);
        CurrState.banned.push(C.id);

    },
    CheckCanBan(CurrState, message) {
        n = 0;
        for (let i = 0; i < CurrState.Banners.length; i++) {
            if (CurrState.Banners[i] == message.author)
                n++;
            if (n >= CurrState.banSize)
                return false;
        }
        return true;
    },
    CheckBanned(CurrState, C) {
        if (CurrState.banned.find(x => x == C.id)) {

            return true;
        }
        return false;
    },
    //remove civ from pool
    opBan(C, CurrState) {

        CurrState.Civs.splice(CurrState.Civs.findIndex(x => x == C.id), 1);
        CurrState.banned.push(C.id);

    },

    CheckBansEnd(CurrState, message) {
        if (CurrState.bansActual >= CurrState.bansFull) {

            Phaser.StartPicks(CurrState, message);
        }
    },
    includesIgnoreCase(arr, value) {
        let LCvalue = value.toLowerCase();

        for (let i = 0; i < arr.length; i++) {
            const E = arr[i];
            if (E.toLowerCase().includes(LCvalue))
                return true;
        }
        return false;
    }
}