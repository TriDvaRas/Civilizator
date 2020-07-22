
const GC = require(`./guildConfig.js`);
module.exports = {
    //check for permissions
    checkRoles(gMember, op, allow) {
        return new Promise((resolve, reject) => {
            GC.getConfig(gMember.guild).then(config => {

                //botOwner
                if (`${gMember.user}` == "<@272084627794034688>") return resolve();

                if (allow) {
                    //check if admin
                    if (allow.admin && gMember.permissions.any('ADMINISTRATOR'))
                        return resolve();
                    //check if op
                    if (allow.op && (op == `${gMember.user}`))
                        return resolve();
                    //check if civilized or civlizator guild
                    if (allow.civ && (gMember.roles.cache.some(role => role.id == config.roleId) || gMember.guild.id == "727081958823165963"))
                        return resolve();
                }

                return reject();
            });
        });

    }
}
