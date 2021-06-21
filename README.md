# Protogen G-UI [![GitHub issues](https://img.shields.io/github/issues/HastagGuigui/g-ui?color=00bfff&style=flat-square)](https://github.com/HastagGuigui/g-ui/issues) [![GitHub forks](https://img.shields.io/github/forks/HastagGuigui/g-ui?color=00e5ff&style=flat-square)](https://github.com/HastagGuigui/g-ui/network) [![GitHub stars](https://img.shields.io/github/stars/HastagGuigui/g-ui?color=fff&style=flat-square)](https://github.com/HastagGuigui/g-ui/stargazers) [![GitHub license](https://img.shields.io/github/license/HastagGuigui/g-ui?color=008cff&style=flat-square)](https://github.com/HastagGuigui/g-ui/blob/main/LICENSE) [![Bot version](https://img.shields.io/badge/G--UI%20version-2.1.0-00bfff?style=flat-square)](https://top.gg/bot/549294278149668874)
### A discord bot (made with Node.JS) that's basically a small RPG with some simple RPG-like features.

---

> P#TAIN ROH

-#Guigui, 2021

---

Default prefix: `g/`

|Symbols|Meaning|
|-|-|
|<>|Optional|
|[]|Obligatory|
|/|Or|
|`something`|Exact term or command reference|

Here's a brief description of every command released and available on the bot:

|Command|Syntax|Description|
|-|-|-|
|help|\<category name/command name/page number\>|Basically display every command here.
|start|∅|Allows you to create your character|
|bugreport|Add the most detailed description of how you made it happen|Use this if you have any problems with the bot (do not abuse it or else you're going to brazil|
|links|∅|some funni links|
|patchnote|\<Version ID>|display funni patch notes|
|credits|∅|Do I really need to explain?|
|character|\<@user#XXXX>|Displays your character (or anyone else's)|
|editchara|\[`0`]* \[`name`/`description`/`image`] <br/>`name` [New character's name] <br/>`description` [New character's description] <br/>`image` avec une image attachée au message|`name`: Changes your character's name <br/>`description`: Changes your character's description <br/>`image`: Changes your character's profile image|
|editstats|\[`0`]* \[`strength`/`defense`/`speed`] \[Value (Int)]|It all relies on a "Stat point" value.<br/>`strength`: Augments the damage dealt per `g/hunt`.<br/>`defense`: Reduces the damage that you end up getting.<br/>`speed`: Reduces `g/hunt` cooldown.|
|roll|\<number/dices`x`faces per dice/a mix of both>|Rolls a dice (or multiple ones), here are some examples: <br> `g/roll 6` will roll a regular 6-sided dice (I got 5 while writing this) <br> `g/roll 2x12` will roll 2 12-sided dices (Rolled a 1 and a 7, damn) <br> `g/roll 5 8x4 2 7` will roll respectively a 5-sided dice, 8 4-sided dices, will flip a coin, and finally roll a 7-sided dice. Yes, you can do really complex stuff. (got a total of 25 out of the maximum 46)|
|shop|∅|Displays what you can buy from G-UI's unsuspicious shop.|
|buyitem|[Item ID] \<Quantity (Int)>|Buy the item you want from G-UI's unsuspicious shop, at the listed price.|
|inventory|\<Page (Int)>|Shows all the items you have in your inventory|
|use|[Item ID]|Allows you to use one of the items in your inventory.|
|hunt|∅|Basically le farming XP.|
|heal|∅|Allows you to heal and recover HP you lost during hunting sessions|
|leaderboard|\<Page (Int)>|Shows who's the best here|
|lang|\[en/fr]|Changes the language used in the bot. (Open to more translations, just DM me on [Twitter](https://twitter.com/G_UI_TWEET) or on Discord (@_Guigui \[YT]#2933) if you want to contribute!)|
|achievements|\<Page (Int)>|Displays your well-earned throphies!|
|vote|∅|[Click here to vote!](https://top.gg/bot/549294278149668874/vote)|
|ping|∅|Pong[!](https://www.youtube.com/watch?v=RKW6rjnYEkc)|
|map|<section position X`;`section position Y>|By default, displays the section you're in, but can also display another section if you want to view it|
|move|[left/down/up/right]|Move on the map|
|modifymap|(Buckle up, there's a lot!) <br>1. `tile` [section X]`;`[section Y] [X]`;`[Y] [new Tile ID] <br>2. `palette` [section X]`;`[section Y] [edit/add/remove/view] <br>2.1. `palette` [X]`;`[Y] `edit` [Tile ID] [New Emoji]<br>2.2. `palette` [X]`;`[Y] `add` [New Emoji] <br>2.3. `palette` [X]`;`[Y] `remove` [Tile ID]<br>2.4. `palette` [X]`;`[Y] `view`<br>3. `collisions` [section X]`;`[section Y] [Tile ID] [true/false]|help me (admins only command)|

*I have plans of making a multiple character thing but gave up

# How can I emulate the bot?
-Download the whole code folder and unzip it inside a folder
<br>-Run inside a command prompt that selects this folder "npm install" (if you don't have NodeJS then click [this](https://nodejs.org/))
<br>-Complete the fields in important.json
<br>-node index.js or whatever you use to launch a nodejs process
<br>-alright

## ⚠ If you're going to use one of the commands for your bot, please credit me in some way.

If you want to contribute to the bot/add new cool commands, feel free to, by DMing #Guigui on [Twitter](https://twitter.com/_GuiguiYT) or Discord (_Guigui [YT]#2933)

Also, to make the bot work, you'll also need a file in the root of the folder called `important.json` (that isn't present by default for security reasons)
### `important.json` template:
```json
{
    "token": "Discord token",
    "DBLtoken":"DBL (top.gg) token.",
    "prefix": "g/",
    "motd": [
        "all",
        "the",
        "messages",
        "the",
        "bot",
        "will",
        "display",
        "beep boop im a proto"
    ],
    "status": "online",
    "betaTesters": [
        "448560475987509268",
        "YOUR DISCORD ID"
    ]
}
```

# Package authors

- [discord.js](https://discord.js.org/#/) by [a lot of people, can't list them all](https://github.com/orgs/discordjs/people)
- [canvas](https://github.com/Automattic/node-canvas) by [TJ Holowaychuk](https://github.com/tj), [Nathan Rajlich](https://github.com/TooTallNate), [Rod Vagg](https://github.com/rvagg), and [Juriy Zaytsev](https://github.com/kangax)
- [twemoji](https://github.com/twitter/twemoji) by [Twitter](https://github.com/twitter/twemoji)
- [node-canvas-with-twemoji-and-discord-emoji](https://github.com/flazepe/node-canvas-with-twemoji-and-discord-emoji#readme) by [Flazepe](https://github.com/flazepe)
- [dblapi.js](https://github.com/top-gg/node-sdk) by [the team behind Top.gg I guess](https://github.com/orgs/top-gg/people)
- [quick.db](https://quickdb.js.org/) by [Loren Cerri](https://github.com/lorencerri)
- [html2json](https://github.com/jxck/html2json) by [Jxck](https://github.com/Jxck)
