import { Message, MessagePayload } from "discord.js";
import commandsPermData from "../data/commandsPermData";
import commandsRegData from "../data/commandsRegData";
import commandsData from "../data/commandsRegData";
import stringsConfig from "../data/stringsConfig";
import { createBaseGameEmbed } from "../managers/embedManager";

export default async function messageHandler(message: Message): Promise<void> {
    if (message.content.toLowerCase() === '!d' && message.author.id === process.env.BOT_OWNER_ID) {
        const regData = commandsRegData.regcommand
        const command = await message.guild?.commands.create(regData);
        const permData = commandsPermData.regcommand
        const perm = await command?.permissions.set({ permissions: permData })
        message.reply(`Registered regcommand`)
    }
}