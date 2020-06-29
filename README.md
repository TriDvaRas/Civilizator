
<img src="https://tdr.s-ul.eu/FYpCCEZi" title="FVCproductions" alt="logo">

# Civilizator Discord Bot
 Civilization V Civ Randomizer for your Discord server 
 
[Invite Link](https://discord.com/oauth2/authorize?client_id=719933714423087135&scope=bot&permissions=268495952)

[Discord Server](https://discord.gg/nFMFs2e)

---

## Table of Contents 

- [Features](#features)
- [Bot commands](#commands)
- [FAQ](#faq)
- [Inspiration](#inspiration)


---

## Features

TODO

---

## Commands

- All commands start with prefix(default !) or bot mention

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

### Civilizator Commands


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
    - A: Yes, you can try out bot in `#civilizator` channel of [bot's discord server](https://discord.gg/nFMFs2e)
- **Q: Can I start multiple games at the same time?**
    - A: No, bot was primarily made for small servers to just play some games with your friends, so I'm not planing the support of multiple games per server.
- **Q: How do I start a game?**
    - A: Just use `start` command
- **Q: Why can't I use `start` command?**
    - A: You need to get the Civilizator role to use it. Also it can only be used in the channel the bot is locked to.
- **Q: Is there Civilization VI support?**
    - A: No
- **Q: Will there be Civilization VI support?**
    - A: Maybe...
- **Q: Can players join game after join phase has ended?**
    - A: No
- **Q: Can I unban Civilization**
    - A: No
- **Q: My question is not in FAQ**
    - A: Try asking in [bot's discord server](https://discord.gg/nFMFs2e)
---


## Inspiration

TODO

---
