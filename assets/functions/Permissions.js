
const GC = require(`./guildConfig.js`);
module.exports = {
    //check for permissions
    checkRoles(gMember, op, allow) {
        return new Promise((resolve, reject) => {
            GC.getConfig(gMember.guild).then(config => {

                //botOwner
                if (`${gMember.user}` == "<@272084627794034688>") return resolve();

                if (allow) {
                    if (allow.admin && gMember.permissions.any('ADMINISTRATOR'))
                        return resolve();
                    if (allow.op && (op == `${gMember.user}`))
                        return resolve();
                    if (allow.civ && (gMember.roles.cache.some(role => role.id == config.roleId)))
                        return resolve();
                }

                return reject();
            });
        });

    }
}
