import { ApplicationCommandData } from "discord.js";

type CommandRegData = { [key: string]: ApplicationCommandData };
export default {
    ping: {
        name: `ping`,
        description: `Sends bot's latency info`,
    },
    emojilist: {
        name: `emojilist`,
        description: `Sends all emoji identifiers of current guild`,
    },
    invite: {
        name: `invite`,
        description: `Sends bot invite link`,
    },
    set: {
        name: `set`,
        description: `Shows game settings menu`,
    },
    start: {
        name: `start`,
        description: `Start a new game!`,
        options: [
            {
                name: `civ5`,
                description: `Civilization V`,
                type: `SUB_COMMAND`,
                options: [
                    {
                        name: `cpp`,
                        description: `How many civs will each player get`,
                        type: `INTEGER`,
                        required: true,
                        choices: [
                            { name: `3`, value: 3 },
                            { name: `1`, value: 1 },
                            { name: `2`, value: 2 },
                            { name: `4`, value: 4 },
                            { name: `5`, value: 5 },
                            { name: `6`, value: 6 },
                        ]
                    },
                    {
                        name: `bpp`,
                        description: `How many civs can each player ban`,
                        type: `INTEGER`,
                        required: true,
                        choices: [
                            { name: `0`, value: 0 },
                            { name: `1`, value: 1 },
                            { name: `2`, value: 2 },
                            { name: `3`, value: 3 },
                        ]
                    }
                ]
            },
            {
                name: `lek`,
                description: `Civilization V + LEK`,
                type: `SUB_COMMAND`,
                options: [
                    {
                        name: `cpp`,
                        description: `How many civs will each player get`,
                        type: `INTEGER`,
                        required: true,
                        choices: [
                            { name: `3`, value: 3 },
                            { name: `1`, value: 1 },
                            { name: `2`, value: 2 },
                            { name: `4`, value: 4 },
                            { name: `5`, value: 5 },
                            { name: `6`, value: 6 },
                        ]
                    },
                    {
                        name: `bpp`,
                        description: `How many civs can each player ban`,
                        type: `INTEGER`,
                        required: true,
                        choices: [
                            { name: `0`, value: 0 },
                            { name: `1`, value: 1 },
                            { name: `2`, value: 2 },
                            { name: `3`, value: 3 },
                        ]
                    }
                ]
            },
            {
                name: `civ6`,
                description: `Civilization VI`,
                type: `SUB_COMMAND`,
                options: [
                    {
                        name: `cpp`,
                        description: `How many civs will each player get`,
                        type: `INTEGER`,
                        required: true,
                        choices: [
                            { name: `3`, value: 3 },
                            { name: `1`, value: 1 },
                            { name: `2`, value: 2 },
                            { name: `4`, value: 4 },
                            { name: `5`, value: 5 },
                            { name: `6`, value: 6 },
                        ]
                    },
                    {
                        name: `bpp`,
                        description: `How many civs can each player ban`,
                        type: `INTEGER`,
                        required: true,
                        choices: [
                            { name: `0`, value: 0 },
                            { name: `1`, value: 1 },
                            { name: `2`, value: 2 },
                            { name: `3`, value: 3 },
                        ]
                    }
                ]
            },
        ]
    },
    regcommand: {
        name: `regcommand`,
        description: `regcommand`,
        defaultPermission: false,
        options: [
            {
                name: `command`,
                description: `command to register`,
                type: `STRING`,
                required: true,
            },
            {
                name: `global`,
                description: `global/guild`,
                type: `BOOLEAN`,
                required: false,
            }
        ]
    },
} as CommandRegData