import { ApplicationCommandData } from "discord.js";

type CommandRegData = { [key: string]: ApplicationCommandData };
export default {
    ping: {
        name: `ping`,
        description: `Sends bot's latency info`,
    },
    roll: {
        name: `roll`,
        description: `Random number generator (literally RNG)`,
        options: [
            {
                name: `min`,
                description: `Minimum value`,
                type: `INTEGER`,
                required: false,
            },
            {
                name: `max`,
                description: `Maximum value`,
                type: `INTEGER`,
                required: false,
            },
            {
                name: `amount`,
                description: `Amount of values`,
                type: `INTEGER`,
                required: false,
            },
        ]
    },
    emojilist: {
        name: `emojilist`,
        description: `Sends all emoji identifiers of current guild`,
    },
    invite: {
        name: `invite`,
        description: `Sends bot invite link`,
        options: [
            {
                name: `raw`,
                description: `Send raw link (for copying)`,
                type: `BOOLEAN`,
                required: false,
            },
        ]
    },
    set: {
        name: `set`,
        description: `Shows game settings menu`,
    },
    version: {
        name: `version`,
        description: `Shows game settings menu`,
    },
    pm: {
        name: `pm`,
        description: `Resends picks messages, so you won't need to scroll to the top of the thread to see them`,
    },
    pickmessages: {
        name: `pickmessages`,
        description: `Resends picks messages, so you won't need to scroll to the top of the thread to see them`,
    },
    gm: {
        name: `gm`,
        description: `Resends main game message, so you won't need to scroll to the top of the thread to see it`,
    },
    gamemessage: {
        name: `gamemessage`,
        description: `Resends main game message, so you won't need to scroll to the top of the thread to see it`,
    },
    dlcs: {
        name: `dlcs`,
        description: `Shows current game dlc info`,
        options: [
            {
                name: `public`,
                description: `Should the list be visible to other players`,
                type: `BOOLEAN`,
                required: false,
            }
        ]
    },
    rollcivs: {
        name: `rollcivs`,
        description: `Generates a set of random civilizations. Lit. /roll but with civilizations`,
        options: [
            {
                name: `game`,
                description: `Choose the game`,
                type: `STRING`,
                required: true,
                choices: [
                    { name: `Civilization V`, value: `civ5` },
                    { name: `Civilization V + LEK`, value: `lek` },
                    { name: `Civilization VI`, value: `civ6` },
                ]
            },
            {
                name: `amount`,
                description: `Choose how many civs you'll get`,
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
            }
        ]
    },
    ban: {
        name: `ban`,
        description: `Ban civilizations during bans phase. You can specify multiple bans at once with extra options`,
        options: [
            {
                name: `civ1`,
                description: `Civilization's id or name/leader alias(or part of it)`,
                type: `STRING`,
                required: true,
            },
            {
                name: `civ2`,
                description: `Civilization's id or name/leader alias(or part of it)`,
                type: `STRING`,
                required: false,
            },
            {
                name: `civ3`,
                description: `Civilization's id or name/leader alias(or part of it)`,
                type: `STRING`,
                required: false,
            }
        ]
    },
    opban: {
        name: `opban`,
        description: `Ban extra civilizations during bans phase without spending standart ban slots. OP only`,
        options: [
            {
                name: `civ`,
                description: `Civilization's id or name/leader alias(or part of it)`,
                type: `STRING`,
                required: true,
            },
        ]
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
    permissions: {
        name: `permissions`,
        description: `Edit Permissions settings`,
        options: [
            {
                name: `pu`,
                description: `Privileged Users`,
                type: `SUB_COMMAND_GROUP`,
                options: [
                    {
                        name: `add`,
                        description: `Add Privileged User`,
                        type: `SUB_COMMAND`,
                        options: [
                            {
                                name: `user`,
                                description: `User to add`,
                                type: `USER`,
                                required: true,
                            },
                        ]
                    },
                    {
                        name: `remove`,
                        description: `Remove Privileged User`,
                        type: `SUB_COMMAND`,
                        options: [
                            {
                                name: `user`,
                                description: `User to remove`,
                                type: `USER`,
                                required: true,
                            },
                        ]
                    }
                ]
            },
            {
                name: `c`,
                description: `Allowed Channels`,
                type: `SUB_COMMAND_GROUP`,
                options: [
                    {
                        name: `add`,
                        description: `Add Allowed Channel`,
                        type: `SUB_COMMAND`,
                        options: [
                            {
                                name: `channel`,
                                description: `Channel to add`,
                                type: `CHANNEL`,
                                required: true,
                            },
                        ]
                    },
                    {
                        name: `remove`,
                        description: `Remove Allowed Channel`,
                        type: `SUB_COMMAND`,
                        options: [
                            {
                                name: `channel`,
                                description: `Channel to remove`,
                                type: `CHANNEL`,
                                required: true,
                            },
                        ]
                    }
                ]
            },
            {
                name: `r`,
                description: `Allowed Roles`,
                type: `SUB_COMMAND_GROUP`,
                options: [
                    {
                        name: `add`,
                        description: `Add Allowed Role`,
                        type: `SUB_COMMAND`,
                        options: [
                            {
                                name: `role`,
                                description: `Role to add`,
                                type: `ROLE`,
                                required: true,
                            },
                        ]
                    },
                    {
                        name: `remove`,
                        description: `Remove Allowed Role`,
                        type: `SUB_COMMAND`,
                        options: [
                            {
                                name: `role`,
                                description: `Role to remove`,
                                type: `ROLE`,
                                required: true,
                            },
                        ]
                    }
                ]
            },
        ]
    },
    news: {
        name: `news`,
        description: `Edit News Channels settings`,
        options: [
            {
                name: `add`,
                description: `Add News Channel`,
                type: `SUB_COMMAND`,
                options: [
                    {
                        name: `channel`,
                        description: `Channel to add`,
                        type: `CHANNEL`,
                        required: true,
                    },
                ]
            },
            {
                name: `remove`,
                description: `Remove News Channel`,
                type: `SUB_COMMAND`,
                options: [
                    {
                        name: `channel`,
                        description: `Channel to remove`,
                        type: `CHANNEL`,
                        required: true,
                    },
                ]
            }
        ]
    },
    settings: {
        name: `settings`,
        description: `Open server-wide Civilizator settings menu`,
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
    unregcommand: {
        name: `unregcommand`,
        description: `unregcommand`,
        defaultPermission: false,
        options: [
            {
                name: `command`,
                description: `command to unregister`,
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
    unregallcommands: {
        name: `unregallcommands`,
        description: `unregallcommands`,
        defaultPermission: false,
        options: [
            {
                name: `global`,
                description: `global/guild`,
                type: `BOOLEAN`,
                required: false,
            }
        ]
    },
    announce: {
        name: `announce`,
        description: `Sends news`,
    },
    about: {
        name: `about`,
        description: `Sends info about the bot`,
    },
} as CommandRegData