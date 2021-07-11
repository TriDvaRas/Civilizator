/* global activeGames, logger, chalk */
const db = require(`../functions/db`)
const Perm = require('../functions/Permissions.js');
module.exports = {
    name: 'dlc',
    description: 'Manage DLCs (Operator)',
    usage:
        `\`dlc <whitelist/white/w/+> <DLCs>\` disables all DLCs which are not in <DLCs>
\`dlc <blacklist/black/b/-> <DLCs>\` disables all DLCs which are in <DLCs>
\`dlc <reset/r>\` enables all DLCs`,
    // eslint-disable-next-line max-lines-per-function
    execute: function execute(message, args, guildConfig) {
        message.delete({ timeout: 5000 })
        //read GameState
        db.getState(activeGames.findKey(x => x.guild.id == message.guild.id), message.guild.id).then(
            state => {
                if (Perm.checkRoles(guildConfig, message.member, state.opId, { admin: true, op: true })) {
                    if (state.phase != "join") return message.channel.send("Wrong phase").then(botMsg => botMsg.delete({ timeout: 5000 }))
                    if (args[0] == "r" || args[0] == "reset") {
                        state.resetDLC()
                        state.embed.updateField("DLCs", "All\u200B")
                        state.embedMsg.edit(state.embed)
                        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] dlc => all`);
                        return;
                    }
                    if (!args[0] || !args[1])
                        return message.channel.send(`Wrong arguments. Try \`${this.name} help\` `).then(botMsg => botMsg.delete({ timeout: 5000 }))

                    let white = null;
                    if (["+", "w", "white", "whitelist"].includes(args[0]))
                        white = true;
                    else if (["-", "b", "black", "blacklist"].includes(args[0]))
                        white = false;
                    else
                        return message.channel.send(`Wrong arguments. Try \`${this.name} help\` `).then(botMsg => botMsg.delete({ timeout: 5000 }))

                    args.shift()
                    const [enabled, disabled] = splitDLCs(state, args, white);
                    state.updateDLC(enabled, disabled)

                    if (state.disabledDLCs.length > 0) {
                        state.embed.updateField("DLCs", `${state.dlcs.join('\n')}\u200B`)
                        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] dlc => ${state.dlcs.join('\n')}`);
                    }
                    else if (state.disabledDLCs.length == 0) {
                        state.embed.updateField("DLCs", "All\u200B")
                        logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] dlc => all`);
                    }
                    state.embedMsg.edit(state.embed)
                    message.channel.send("Updated DLCs").then(botMsg => botMsg.delete({ timeout: 5000 }))
                }
                else
                    message.channel.send("Operator command").then(botMsg => botMsg.delete({ timeout: 5000 }))

            },
            () => {
                message.channel.send("No game found. Use `start` command to create one")
                    .then(botMsg => botMsg.delete({ timeout: 5000 }))
            }
        )
    },
};
function splitDLCs(state, args, white) {
    let enabled = state.dlcs.slice()
    if (white)
        enabled = enabled.filter(x => {
            for (const arg of args) {
                if (x.toLowerCase().includes(arg.toLowerCase()))
                    return true
            }
            return false
        })
    else
        for (const arg of args)
            enabled = enabled.filter(x => !x.toLowerCase().includes(arg.toLowerCase()))

    let disabled = [...state.disabledDLCs, ...state.dlcs.filter(x => !enabled.includes(x))]
    return [enabled, disabled]


}