
module.exports = {
    CheckBanned(state, C) {
        if (state.banned.find(x => x == C.id)) {

            return true;
        }
        return false;
    },
    Ban(C, state) {
        state.bansActual = parseInt(state.bansActual) + 1;
        state.Civs.splice(state.Civs.findIndex(x => x == C.id), 1);
        state.banned.push(C.id);

    },
    CheckCanBan(state, message) {
        n = 0;
        for (let i = 0; i < state.Banners.length; i++) {
            if (state.Banners[i] == message.author)
                n++;
            if (n >= state.banSize)
                return false;
        }
        return true;
    },
    CheckBanned(state, C) {
        if (state.banned.find(x => x == C.id)) {

            return true;
        }
        return false;
    },
    CheckDisabled(state, C) {
        if (state.disabled.find(x => x == C.id))
            return true;
        return false;
    },
    //remove civ from pool
    opBan(C, state) {

        state.Civs.splice(state.Civs.findIndex(x => x == C.id), 1);
        state.banned.push(C.id);

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