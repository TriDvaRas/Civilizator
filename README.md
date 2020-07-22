
<img src="https://tdr.s-ul.eu/FYpCCEZi" title="FVCproductions" alt="logo">

# Civilizator Discord Bot

## About

Discord bot for randoming sets of Civilization V civs for each player.
Bot is primarily meant to be used in small servers by friends companies and just to make the game fun and increase variety of picks.  

Bot's idea is to make random Civilization games less random and more interesting. Instead of giving each player one random civ bot gives them pool of 1-6 civs to pick from. Prior to this civs can also be baned so no one can get them. Bot also supports rerolling: if more than 70% of players vote to reroll each player's pool would be rerandomed! 


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
| start | \<CivPerPlayer(1-6)\> \[BansPerPlayer(0-4)\] | Starts a new game | !start 3 1 | Civilized |
| | | By default BansPerPlayer is 0 |  | Civilized |
| dlc | \<whitelist/white/w/+\> \<DLCs\> | Disables all **not** metioned DLCs | !dlc w vanila g&k Mong | Operator |
|   | \<blacklist/black/b/-\> \<DLCs\> | Disables all metioned DLCs | !dlc b bnw gods korea | Operator |
|   | \<reset/r\> | Enables all DLCs | !dlc b bnw gods korea | Operator |
| set | civs \<1-6\> | Changes current game's BansPerPlayer value | !set civs 3 | Operator |
|   | bans \<0-4\> | Changes current game's BansPerPlayer value | !set bans 1 | Operator |
| ban | <Id/Alias> | Bans civilization from pool during bans phase. As alias you can use part of Civilization name or part of it's leader's name  | !roll | everyone |


---

## FAQ

- **Q: Can I try using a bot without adding it to my server?**
    - A: Yes, you can try out bot in `#civilizator` channel of [bot's discord server](https://discord.gg/nFMFs2e).
- **Q: How do I start a game?**
    - A: Just use `start` command.
- **Q: Why can't I use `start` command?**
    - A: You need to get the Civilizator role to start a game. Also it can only be used in the channel the bot is locked to.
- **Q: Bot's reactions seem to appear slow. Is this ok?**
    - A: Yes, Discord API has a limit of 4 reactions per second.
- **Q: Can I start multiple games at the same time?**
    - A: No, bot was primarily made for small servers to play with your friends, so  the support of multiple simultaneous games per server is not planned.
- **Q: Is there Civilization VI support?**
    - A: No.
- **Q: Will there be Civilization VI support?**
    - A: Not planned but maybe someday...
- **Q: Can players join game after join phase has ended?**
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
