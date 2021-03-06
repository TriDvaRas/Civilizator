module.exports =
    [
        {
            head: `**About**`,
            text: `<@719933714423087135>'s main feature is randomizing Civilization picks (CivRandomizer)
Currently supported games: Civ5, Civ5+LEK, Civ6. Use \`start help\` or \`fast help\` for more info about choosing game. 
Randomizer gives each player a set of civs to pick from.
If you enable bans players can also **ban** civs, removing them from random pool 
**DLCs** can also be disabled if someone doesn't have some or you just want to play Vanilla game 
After everyone got their civs they can vote to reroll. If 70%+ of players has voted all player will get a new set to pick from.
`
        },
        {
            head: `**Commands usage and Prefix**`,
            text: `To use bot's commands you need to start your message with the prefix or bot mention (e.g. \`!start\` or \`@Civilizator start\`)
Bot's default prefix is \`!\`, but you can change it using \`settings prefix\` command. To view full command list you can use \`help\` or visit bot's [github page](https://github.com/TriDvaRas/Civilizator). To get more info about a specific command use \`<command> help\` (e.g. \`!start help\`)
**__IMPORTANT!__
If your server has a bot with  \`!ban\` command you should change <@719933714423087135>'s prefix to avoid actually banning someone** 
`
        },
        {
            head: `**Bot channel and role**`,
            text: `Then you add <@719933714423087135> to your server bot automatically creates \`#civilizator\` channel and \`Civilized\` role
- By default \`#civilizator\` channel is only visible to users with \`Civilized\` role (you can change this in channel settings)
- CivRandomizer-related commands are bound to your \`#civilizator\` and are ignored in other channels. 
- You need to have a \`Civilized\` role (or be server admin) to \`start\` a game (anyone can join) or use \`fast\` command. Also by default this channel is only visible to users with \`Civilized\` role. You can change it in channels settings
- All members of your server can get the role with \`getrole\` command. You can disable this command with \`settings getrole\`. You can change bound channel using \`settings channel set\` command in a channel you want to set bond to. 
- Channel and role names can be changed as you wish. If you accidentally delete them you can recreate them using \`settings role create\` and \`settings channel create\`.
`
        },
        {
            head: `**Bugs, Suggestions, Updates**`,
            text: `For bug reporting you can use [bot's Discord server](https://discord.gg/nFMFs2e) or you can send them directly to bot's DM and if you really want to you can messsage TriDvaRas#4805.
There you can also find suggestions channel and subscribe to updates channel.
`
        },
        {
            head: `**TL;DR**`,
            text: `CivRandomizer Discord Bot
Default prefix is \`!\`. Can be changed with \`settings prefix <NewPrefix>\`
Avoid banning users with another bot's \`!ban\` command
To start a game go to \`#civilizator\` and use \`start <CivPerPlayer> [BansPerPlayer]\` to start a normal game, or \`fast <Players> <CivsPerPlayer>\` to start a fast game(no bans, no picks, no rerolls, no statistics)`
        }
    ]