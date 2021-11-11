import { Permissions, ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";

export default {
    name: 'invite',
    execute: async (interaction: CommandInteraction) => {
        const raw = interaction.options.getBoolean(`raw`, false)
        const invite = client.generateInvite({
            permissions: [
                Permissions.FLAGS.CHANGE_NICKNAME,
                Permissions.FLAGS.SEND_MESSAGES,
                Permissions.FLAGS.EMBED_LINKS,
                Permissions.FLAGS.ATTACH_FILES,
                Permissions.FLAGS.MANAGE_THREADS,
                Permissions.FLAGS.USE_PUBLIC_THREADS,
                Permissions.FLAGS.USE_PRIVATE_THREADS,
                Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
                Permissions.FLAGS.USE_EXTERNAL_STICKERS,
                Permissions.FLAGS.USE_EXTERNAL_STICKERS,
            ],
            scopes:[
                'applications.commands',
                'bot',
            ]
        })
        interaction.reply(`[Click here](${invite}) to invite bot to another server${raw?`\n${invite}`:``}`)
    }
}