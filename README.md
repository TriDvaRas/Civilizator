<img src="https://tdr.s-ul.eu/FYpCCEZi" title="FVCproductions" alt="logo">

# Civilizator Discord Bot

<a href="https://discord.gg/nFMFs2e">
  <img alt="Bot Discord" src="https://img.shields.io/discord/727081958823165963?label=Join%20Discord%20Server">
</a>
<a href="https://discord.com/api/oauth2/authorize?client_id=727499119991455807&scope=applications.commands+bot&permissions=257765459968">
  <img alt="Bot Invite" src="https://img.shields.io/badge/Invite%20Bot-blue">
</a>
<a href="https://www.paypal.com/donate?hosted_button_id=ER5KWL52L6LLL">
  <img alt="Support" src="https://img.shields.io/badge/Support%20the%20Project%20-red">
</a>

  <img alt="GitHub" src="https://img.shields.io/github/license/tridvaras/civilizator">

## About

Civilizator is a Discord Bot implementation of CivRandomizer (random set of civs to pick from for each player).
Currently supported games: Civ5, Civ5+[LEK](https://docs.google.com/document/d/18tsjg2C1wKA7I41GktDRr6R83eUrhn4FHi9EUEtpKvI/edit), Civ6.

Bot's idea is to make random Civilization games less random and more strategic by giving each player a set of 1-6 civs to pick from. Prior to this civs can also be baned, so no one can get them. Also there is a reroll feature: if more than 70% (can be configured) of players vote to reroll, each player would receive a new set!

As of version 3.0 bot uses Discord's built-in slash commands, buttons and threads to receive commands and host games.

---

## FAQ

- **Q: What prefix does bot use?**
  - A: Bot uses Discord's built-in slash commands. Discord plans on disabling read messages permission for all public bots in 2022 so using prefixes won't be a posibility. And slash commands are much more convenient. 
- **Q: Bot ignores my commands (This interaction failed). What should I do?**
  - A: Firstly check if the bot is online, if not message TriDvaRas#4805 about it. If the bot is online check if there are any outages on Discord's side ([can be checked here](https://discordstatus.com/)) and if other bot commands work, then message TriDvaRas#4805 with the info you've found
- **Q: Can I try using a bot without adding it to my server?**
  - A: Yes, you can try out the bot in `#civilizator` channel of [bot's discord server](https://discord.gg/nFMFs2e).
- **Q: How do I start a game?**
  - A: Just use `/start` command.
- **Q: Can I start multiple games at the same time?**
  - A: Yes, each bot-created thread is considered a separate game and you can have as many of them as you want.
- **Q: Can users join game after join phase has ended?**
  - A: No.
- **Q: Can I go back to previous phase?**
  - A: No, you need to `/start` a new game.
- **Q: Can I unban Civilization?**
  - A: No.
- **Q: My question is not in FAQ**
  - A: Try asking in [bot's discord server](https://discord.gg/nFMFs2e). Or message TriDvaRas#4805
- **Q: Is there Civilization VI support?**
  - A: Yes.
- **Q: When was civilizations list last updated?**
  - A: You can use `/version` command to check which game versions were used for the last civlist update.
- **Q: Will civs from future game updates be added to the bot?**
  - A: I try to add new civs as they are being released but in case i miss something please message me (TriDvaRas#4805) about it
---

## Inspiration

- http://leshaigraet.ru/civ-randomizer/ (died long time ago)

- http://civdrafter.com/civ5/

- http://sempris.od.ua/civ/random.html

---
