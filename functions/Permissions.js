
module.exports = {
    //check for permissions
    checkRoles(gConfig, gMember, op, allow) {
        if (`${gMember.user.id}` == "272084627794034688")
            return true
        else if (allow) {
            //check if admin
            if (allow.admin && gMember.permissions.any('ADMINISTRATOR'))
                return true
            //check if op
            else if (allow.op && (op == `${gMember.user.id}`))
                return true
            //check if civilized or civlizator guild
            else if (allow.civ && (gMember.roles.cache.some(role => role.id == gConfig.roleId) || gMember.guild.id == "727081958823165963"))
                return true
        }
        return false
    }
}