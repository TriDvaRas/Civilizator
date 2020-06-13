
const GC = require(`./guildConfig.js`);
module.exports = {
    //check for permissions
    checkRoles(member, op, allow) {
        const config = GC.getConfig(member.guild);
        //botOwner
        if (`${member.user}` == "<@272084627794034688>") return true;
        
        if (allow.admin && member.hasPermission('ADMINISTRATOR')) return true;
        if (allow.op  && (op == `${member.user}`)) return true;
        if (allow.civ && (member.roles.cache.some(role => role.id == config.roleId))) return true;
        return false;
    }
}
