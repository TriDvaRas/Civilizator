
const GC = require(`./guildConfig.js`);
module.exports = {
    //check for permissions
    checkRoles(gMember, op, allow) {
        const config = GC.getConfig(gMember.guild);
        //botOwner
        if (`${gMember.user}` == "<@272084627794034688>") return true;
        
        if (allow) {
            if (allow.admin && gMember.permissions.any('ADMINISTRATOR'))
                return true;
            if (allow.op && (op == `${gMember.user}`))
                return true;
            if (allow.civ && (gMember.roles.cache.some(role => role.id == config.roleId)))
                return true;
        }

        return false;
    }
}
