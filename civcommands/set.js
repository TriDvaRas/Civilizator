/* global logger chalk activeGames */
const Perm = require('../functions/Permissions.js');
const db = require(`../functions/db`)
module.exports = {
    name: 'set',
    description: 'change current game settings',
    usage: `\`set bans <0-4>\` - change bans per player 
\`set civs <1-6>\` - change civs per player
`,
    execute: function execute(message, args, guildConfig) {
        message.delete({ timeout: 5000 })
        db.getState(activeGames.findKey(x => x.guild.id == message.guild.id), message.guild.id).then(
            state => {
                if (Perm.checkRoles(guildConfig, message.member, state.opId, { admin: true, op: true })) {
                    if (state.phase != "join") {
                        message.reply("You can change game settings only during join phase")
                            .then(m => m.delete({ timeout: 5000 }))
                        return;
                    }
                    let newValue = parseInt(args[1]);
                    if (!newValue)
                        return message.channel.send(`Wrong arguments. Try \`${this.name} help\` `)
                            .then(m => m.delete({ timeout: 5000 }))
                    switch (args[0]) {
                        case "b":
                        case "bans":
                        case "bpp":
                            state.updateSettings({ bpp: Math.min(Math.max(newValue, 0), 4) })
                            message.channel.send(`Set BPP to ${state.bpp}`)
                                .then(m => m.delete({ timeout: 5000 }))
                            state.embed.updateField("Bans per player", `${state.bpp}\u200B`)
                            state.embedMsg.edit(state.embed)
                            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] changed bans to ${state.bpp}`);
                            break;
                        case "c":
                        case "civs":
                        case "cpp":
                            state.updateSettings({ cpp: Math.min(Math.max(newValue, 1), 6) })
                            message.channel.send(`Set CPP to ${state.cpp}`)
                                .then(m => m.delete({ timeout: 5000 }))
                            state.embed.updateField("Civs per player", `${state.cpp}\u200B`)
                            state.embedMsg.edit(state.embed)
                            logger.log(`cmd`, `[${chalk.magentaBright(message.guild.name)}] [${chalk.magentaBright(message.author.tag)}] changed civs to ${state.cpp}`);
                            break;
                        default:
                            message.channel.send(`Wrong arguments. Try \`${this.name} help\` `)
                                .then(m => m.delete({ timeout: 5000 }))
                            break;
                    }
                }
                else
                    message.channel.send("Operator command")
                        .then(m => m.delete({ timeout: 5000 }))
            },
            () => message.channel.send("No game found. Use `start` command to create one").then(botMsg => botMsg.delete({ timeout: 5000 }))
        )
    },
};