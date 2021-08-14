import { ApplicationCommandPermissions } from "discord.js";

type CommandPermData = { [key: string]: ApplicationCommandPermissions[] };
export default {
    regcommand: [
        {
            id: '272084627794034688',
            type: 'USER',
            permission: true,
        }
    ],
} as CommandPermData