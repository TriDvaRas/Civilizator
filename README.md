
<img src="https://tdr.s-ul.eu/FYpCCEZi" title="FVCproductions" alt="logo">

# Civilizator Discord Bot

## About

Civilizator is a Discord Bot implementation of CivRandomizer (random set of civs to pick from for each player).
Currently supported games: Civ5, Civ5+[LEK](https://docs.google.com/document/d/18tsjg2C1wKA7I41GktDRr6R83eUrhn4FHi9EUEtpKvI/edit), Civ6. Use \`start help\` or \`fast help\` for more info about choosing game.
Bot is primarily meant to be used in small servers by friends companies and just to make the game fun and increase variety of picks.  

Bot's idea is to make random Civilization games less random and more interesting. Instead of giving each player one random civ bot gives them pool of 1-6 civs to pick from. Prior to this civs can also be baned so no one can get them. Bot also supports rerolling: if more than 70% of players vote to reroll each player's pool would be rerandomed! 

There is also original CivRandomizer (`fast` command) without picks, rerolls, bans or stats.

[Invite Link](https://discord.com/oauth2/authorize?client_id=719933714423087135&scope=bot&permissions=268495952)

[Discord Server](https://discord.gg/nFMFs2e)

---

## Table of Contents 

- [About](#about)
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Bot commands](#commands)
  - [Standard Commands](#standard-commands)
  - [Civilization Commands](#civilization-commands)
- [FAQ](#faq)
- [Inspiration](#inspiration)


---

## Features

### Intuitive UI 

Bot uses embed-reactions UI so you can almost forget about typing commands and just press buttons.

![UI GIF](https://tdr.s-ul.eu/cET6clv5)

### Manageable DLCs

By default all DLCs are enabled but you can change this with `dlc` command

![DLC GIF](https://tdr.s-ul.eu/ukTLgPxd)


### Bans

If you choose `BansPerPlayer` 1-4 when creating a game there would be a ban phase, where you can ban civs from random pool

![BAN GIF](https://tdr.s-ul.eu/IdpIKLo3)


### Picks

In the picks phase you can choose your pick to save it in game's UI and bot's pick statistics

![PICK GIF](https://tdr.s-ul.eu/ONxWVHA6)


### Rerolls

Players can vote to reroll and after 70% of players have voted, all players would get a new pool of civs to pick from

![RE GIF](https://tdr.s-ul.eu/pKxEYD85)


###

---

## Commands

- All commands start with prefix (default is `!`) or bot mention

- Permissions stands for minimal permission user must have to use the command
- Permissions are:
  - Admin -- user with server admin permission
  - Operator -- user who started the game
  - Civilized -- Civilized role
  - Anyone
- \<argument\> stands for required arguments
- \[argument\] stands for optional arguments

### Standard Commands

| Command | Arguments | Description | Usage example | Permissions |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| createchannel | | Create Civilizator channel| !createchannel | Admin |
| createrole | | Create Civilized channel | !createrole | Admin|
| getrole | | Gives you Civilized role if enabled on server | !getrole | anyone |
| getrole+ | | Enables getrole command | !getrole+ | Admin |
| getrole- | | Disables getrole command | !getrole- | Admin |
| help | | DMs you the command list | !help | anyone |
| info | | Gives info about what Civilizator is and how to use it | !info | anyone |
| invite | | Gives bot invite link | !invite | anyone |
| lockchannel | | Changes channellock to this channel. Civilization commands only work in locked channel | !lockchannel | Admin |
| ping | | Ping! | !ping | everyone |
| prefix | <new prefix> | Change bot's prefix | !prefix `` | Admin |
| roll | | gives random number 1-100 | !roll | everyone |
|  | \<N\> | gives random number 1-N | !roll 410 | everyone |
|  | \<M\>-\<N\> | gives random number M-N | !roll 98-15532| everyone |
|  | \<M\>d\<N\> | gives M random numbers 1-N | !roll 2d6 | everyone |

### Civilization Commands



| Command | Arguments | Description | Usage example | Permissions |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| start | \[game\] \<CivPerPlayer(1-6)\> \[BansPerPlayer(0-4)\] | Starts a new game | !start 3 1 | Civilized |
| | | By default BansPerPlayer is 0 |  | Civilized |
| | | \[game\] is optional argument to choose the game you play |  | Civilized |
| | | Available games are: civ5(default), lek, civ6 |  | Civilized |
| fast | \[game\] \<Players(1-16)\> \<CivPerPlayer(1-6)\> \[-/+\] \[DLCs to enable/disable\] | Fast game (original CivRandomizer) | !fast 3 3 | Civilized |
| | | \[game\] is optional argument to choose the game you play |  | Civilized |
| | | Available games are: civ5(default), lek, civ6 |  | Civilized |
| dlc | \<whitelist/white/w/+\> \<DLCs\> | Disables all **not** metioned DLCs | !dlc w vanila g&k Mong | Operator |
|   | \<blacklist/black/b/-\> \<DLCs\> | Disables all metioned DLCs | !dlc b bnw gods korea | Operator |
|   | \<reset/r\> | Enables all DLCs | !dlc b bnw gods korea | Operator |
| set | civs \<1-6\> | Changes current game's BansPerPlayer value | !set civs 3 | Operator |
|   | bans \<0-4\> | Changes current game's BansPerPlayer value | !set bans 1 | Operator |
| ban | <Id/Alias> | Bans civilization from pool during bans phase. As alias you can use part of Civilization name or part of it's leader's name  | !roll | everyone |


---

## FAQ

- **Q: What prefix does bot use?**
    - A: Default bot prefix is `!` You can view bot's current settings(including prefix) by mentioning it (send `@Civilizator` in any channel bot can read/write to)
- **Q: Bot ignores my commands. What should I do?**
    - A: First check if you're using **right prefix**. 
    If the command you're using is in [this list](#Civilization-Commands) you should use it in bot's bound channel. You can check which one it is by mentioning the bot (send `@Civilizator` in any channel bot can read/write to). If bot ignores even mentions then bot probably **can't read or write** messages in your channel/server. Also most functions use **Embeds** so `Embed Links` permission is required. 
- **Q: Can I try using a bot without adding it to my server?**
    - A: Yes, you can try out bot in `#civilizator` channel of [bot's discord server](https://discord.gg/nFMFs2e).
- **Q: How do I start a game?**
    - A: Just use `start` command.
- **Q: Why can't I use `start` command?**
    - A: You need to get the Civilizator role to start a game. You can get it using `getrole` command, if server alows it. Also it can only be used in the channel the bot is locked to.
- **Q: Bot's reactions seem to appear slowly. Is this ok?**
    - A: Yes, Discord API has a limit of 4 reactions per second.
- **Q: Can I start multiple games at the same time?**
    - A: No, bot was primarily made for small servers to play with your friends, so  the support of multiple simultaneous games per server is not planned.
- **Q: Is there Civilization VI support?**
    - A: No.
- **Q: Will there be Civilization VI support?**
    - A: WIP.
- **Q: Can users join game after join phase has ended?**
    - A: No.
- **Q: Can I get back to previous phase?**
    - A: No, you need to `start` a new game.
- **Q: Can I unban Civilization?**
    - A: No.
- **Q: My question is not in FAQ**
    - A: Try asking in [bot's discord server](https://discord.gg/nFMFs2e)
---


## Inspiration

- http://leshaigraet.ru/civ-randomizer/  (died long time ago)

- http://civdrafter.com/civ5/

- http://sempris.od.ua/civ/random.html
---
