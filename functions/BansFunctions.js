
module.exports = {
    checkBanned(state, C) {
        if (state.banned.find(x => x == C.id)) 
            return true;
        return false;
    },
    checkCanBan(state, user) {
        let player = state.players.find(u => u.id == user.id);
        if (player.bans.length >= state.bpp)
            return false
        return true
    },
    checkDisabled(state, C) {
        if (state.disabledCivs.find(x => x == C.id))
            return true;
        return false;
    },
    //remove civ from pool
    opBan(C, state) {
        state.civs.splice(state.civs.findIndex(x => x == C.id), 1);
        state.banned.push(C.id);
    }
}