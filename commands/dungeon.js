const Discord = require('discord.js')
var functions = require("./functions/Tools")
var dungeonAreas = require("../dungeonAreas.json")

exports.run = async (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var dungeonTier = parseInt(args[0]) || 1
    var minimum = 2
    var maximum = 8
    if(args[1] == "--solomode"){
        minimum = 1
        maximum = 1
    }
    if(dungeonTier > 1)return message.channel.send("This dungeon tier isn't actually available.")
    var dungeonData = dungeonAreas.filter(x => x.dungeonTier == dungeonTier)
    var fakeMap = dungeonData[0]
    var rewards = {
        money: 0,
        xp: 0,
        items: []
    }
    var enemies = fakeMap.enemies
    var emojis = fakeMap.emojisUsed
    var inventaire = db.get(message.author.id + ".characters[0].inventory")
    var hasStarted = false;
    if(inventaire.includes('dungeon'+dungeonTier)){
        var players = [{
            user: message.author.id,
            X: fakeMap.startingPos.x,
            Y: fakeMap.startingPos.y,
            health: db.get(message.author.id + ".characters[0].currentHealth"),
            maxHealth: db.get(message.author.id + ".characters[0].stats.maxHealth"),
            strength: db.get(message.author.id + ".characters[0].stats.strength"),
            defense: db.get(message.author.id + ".characters[0].stats.defense"),
        }]
        var startingEmbed = new Discord.MessageEmbed()
            .setTitle("New dungeon starting soon!")
            .setDescription("It requires 2 to 8 (yes) players to start!")
            .addField("Currently participating users:", db.get(message.author.id + ".characters[0].charactername"))
            .setFooter("To participate, click the ⚔️ emoji. \nIf everything is ready, the game creator has to press the 🏁. \n To cancel, the game creator has to press the 🛑. You can also press it to leave.")
        var msg = await message.channel.send(startingEmbed)
        await msg.react("⚔️")
        await msg.react("🏁")
        await msg.react("🛑")

        tryToReact (msg, ["⚔️", "🏁", "🛑"])


        var reactions = [
            "⚔️",
            "🏁",
            "🛑"
        ]


        const filter = (reaction, user) => db.get(user.id + ".characters") && reactions.includes(reaction.emoji.name)
        const collector = msg.createReactionCollector(filter, {time: 180000})


        collector.on('collect', async (reaction, user) => {
            console.log(reaction.emoji.name)
            switch (reaction.emoji.name) {
                case "⚔️":
                    if(players.find(player => player.user == user.id)) return;
                    if(players.length > maximum) {
                        if(maximum <= 1){
                            message.channel.send("The solo only mode is activated.")
                        }else{
                            message.channel.send("The party is full!")
                        }
                    } else {
                        players.push({
                            user: user.id,
                            X: fakeMap.startingPos.x,
                            Y: fakeMap.startingPos.y,
                            health: db.get(user.id + ".characters[0].currentHealth"),
                            maxHealth: db.get(user.id + ".characters[0].stats.maxHealth"),
                            strength: db.get(user.id + ".characters[0].stats.strength"),
                            defense: db.get(user.id + ".characters[0].stats.defense"),
                        })
                        var DisplayedPlayers = [];
                        players.forEach(player => {
                            DisplayedPlayers.push(db.get(player.user + ".characters[0].charactername"))
                        })
                        var editedEmbed = new Discord.MessageEmbed()
                        .setTitle("New dungeon starting soon!")
                        .setDescription("It requires 2 to 8 players to start!")
                        .addField("Currently participating users:", DisplayedPlayers.join('\n'))
                        .setFooter("To participate, click the ⚔️ emoji. \nIf everything is ready, the game creator has to press the 🏁. \n To cancel, the game creator has to press the 🛑. You can also press it to leave.")
                        msg.edit(editedEmbed)
                        console.log("Challenger incoming")
                    }
                    break;
                case "🏁":
                    if(user.id == message.author.id){
                        if(players.length >= minimum){
                            if(players.length <= maximum){
                                hasStarted = true;
                                msg.delete();
                                var items = db.get(message.author.id + ".characters[0].inventory") //inventaire
                                var deletePosition = items.indexOf("dungeon"+dungeonTier)
                                var _a = items.splice(deletePosition, 1)
                                console.log(_a, items)
                                db.set(message.author.id + ".characters[0].inventory", items)
                                theThing();
                            }else{
                                message.channel.send("You need less than "+maximum+" players to start a game!")
                            }
                        }else{
                            message.channel.send("You need at least "+minimum+" players to start a game!")
                        }
                    }
                    break;
                case "🛑":
                    if(user.id == message.author.id){
                        msg.delete();
                        hasStarted = true;
                        message.channel.send("Game cancelled.").then(m => m.delete({timeout: 10000}))
                    }else{
                        if(players.find(x => x.user == user.id)){
                            var deletePos = players.findIndex(x => x.user == user.id)
                            players.splice(deletePos, 1)
                        }
                        var DisplayedPlayers = [];
                        players.forEach(player => {
                            DisplayedPlayers.push(db.get(player.user + ".characters[0].charactername"))
                        })
                        var editedEmbed = new Discord.MessageEmbed(msg.embeds[0])
                            .fields[0].value = DisplayedPlayers.join('\n')
                        msg.edit(editedEmbed)
                    }
                    break;
            
                default:
                    break;
            }
            
        })


        collector.on('end', () =>{
            console.log("h")
            msg.delete();
            if(!hasStarted){
                message.channel.send("The game has been cancelled for inactivity (or someone deleted the message). Just reexecute the command!")
            }
        })
    }else{
        message.channel.send("You don't seem to have the required item to open a dungeon.")
    }

    async function theThing() {
        var emojilinks = []
        for (let i = 0; i < 16; i++) {
            var emoji = emojis[i] || "potatoAndBanana"
            var str;
            if (emoji.startsWith('\\')){
                str = emoji
            }else{
                str = "\\" + emoji
            }
            emojilinks[i] = functions.getTwemojiLink(str) || "https://media.discordapp.net/attachments/747486528107708589/778637841969446962/unknown.png"
            
            
        }
        var attachment = await functions.createDungeonMap(fakeMap, db, players, emojilinks, enemies)
        message.delete()
        
        message.channel.send(attachment).then(async newM => {
            await newM.react('⬆️')
            await newM.react('⬅️')
            await newM.react('⬇️')
            await newM.react('➡️')
            await newM.react('⚔️')
            var possibleKeyActions = [
                "⬅️",
                "⬆️",
                "⬇️",
                "➡️",
                "⚔️",
                "🛑",
                "💀"
            ]
            var filter = (reaction, user) => {
                return possibleKeyActions.includes(reaction.emoji.name) && user.id != bot.user.id;
            };
            var collector = newM.createReactionCollector(filter, {time: 600000})
    
            collector.on('collect', async (reaction, user) => {
                if (user.bot) return;
                if (!players.find(x => x.user == user.id)) {
                    return message.channel.send(`Sorry ${user.tag}, you can't join, the game already started.`)
                }
                var player = players.find(x => x.user == user.id)
                var playerID = players.findIndex(x => x.user == user.id)
                switch (reaction.emoji.name) {
                    case "⬆️":
                        if (functions.ScanCollisionsVersion2(player.X, player.Y - 2, fakeMap)){
                            player = {
                                user: player.user,
                                X: player.X,
                                Y: player.Y - 1,
                                health: player.health,
                                maxHealth: player.maxHealth,
                                strength: player.strength,
                                defense: player.defense,
                            }
                        }
                        break;
                
                    case "⬅️":
                        if (functions.ScanCollisionsVersion2(player.X - 1, player.Y - 1, fakeMap)){
                            player = {
                                user: player.user,
                                X: player.X - 1,
                                Y: player.Y,
                                health: player.health,
                                maxHealth: player.maxHealth,
                                strength: player.strength,
                                defense: player.defense,
                            }
                        }
                        break;
                        
                    case "⬇️":
                        if (functions.ScanCollisionsVersion2(player.X, player.Y, fakeMap)){
                            player = {
                                user: player.user,
                                X: player.X,
                                Y: player.Y + 1,
                                health: player.health,
                                maxHealth: player.maxHealth,
                                strength: player.strength,
                                defense: player.defense,
                            }
                        }
                        break;
    
                    case "➡️":
                        if (functions.ScanCollisionsVersion2(player.X+1, player.Y-1, fakeMap)){
                            player = {
                                user: player.user,
                                X: player.X + 1,
                                Y: player.Y,
                                health: player.health,
                                maxHealth: player.maxHealth,
                                strength: player.strength,
                                defense: player.defense,
                            }
                        }
                        break;
    
                    case "⚔️":
                        //check
                        var nearbyEnemies = enemies.filter(x => player.X-2 < x.X && x.X < player.X+2 && player.Y-2 < x.Y+1 && x.Y+1 < player.Y + 2)
                        console.log(nearbyEnemies)
                        if (Array.isArray(nearbyEnemies) && !nearbyEnemies.length) return message.channel.send("There is no enemies nearby.").then(m => m.delete({timeout: 5000}))
                        else{
                            var strength = (user.id + ".characters[0].stats.strength")
                            for (let i = 0; i < nearbyEnemies.length; i++) {
                                const x = nearbyEnemies[i];
                                console.log(x)
                                x.health -= parseInt((strength/5)* Math.round(Math.random() * 5))
                                if (x.health <= 0){
                                    nearbyEnemies.splice(i, 1)
                                    i--
                                    message.channel.send("Killed an enemy. " + i + "/" + (nearbyEnemies.length + 1)).then(m => {
                                        m.delete({ timeout: 10000 })
                                    })
                                }
                            }
                        }
                        break;
                    
                    case "🛑":
                        collector.stop()
                        return;
                        break;

                    case "💀":
                        players = []
                        break;
                    default:
                        break;
                }
                collector.resetTimer()
                collector.empty()
                if(players.length > 0) players[playerID] = player
                var attachment = await functions.createDungeonMap(fakeMap, db, players, emojilinks, enemies)
                enemies = functions.newEnemiesPosition(enemies, players, fakeMap)
                players = functions.damagePlayers(enemies, players)
                if(players.length <= 0){
                    message.channel.send("All characters have been eliminated, and have been kicked out of the dungeon. (Game ended.)");
                    rewards.xp = 0
                    collector.stop();
                }
    
                var checkIfEnemiesHaveAllDied = enemies.filter(x => x.health != null)
                if (checkIfEnemiesHaveAllDied.length <= 0) {
                    rewards.xp += fakeMap.rewards.xp
                    rewards.money += fakeMap.rewards.money
                    rewards.items += fakeMap.rewards.items
                    if (dungeonData[fakeMap.floor + 1]){
                        message.channel.send("You beat all enemies, continue to a superior floor or leave? \n \n✅ Continue. \n❌ Leave.").then(endFloorThing => {
                            endFloorThing.react('❌').then(() => endFloorThing.react('✅'))
                            var confirmOrCancel = [
                                '❌',
                                '✅'
                            ]
                            var filter2 = (reaction, user) => {
                                return confirmOrCancel.includes(reaction.emoji.name) && user.id != bot.user.id;
                            };
                            var collector2 = endFloorThing.createReactionCollector(filter2, {time: 60000})
                            collector2.on("collect", async (reaction, user) => {
                                console.log(reaction.emoji.name)
                                switch (reaction.emoji.name) {
                                    case '❌':
                                        collector.stop()
                                        collector2.stop()
                                        break;
        
                                    case '✅':
                                        fakeMap = dungeonData[fakeMap.floor + 1]
                                        enemies = fakeMap.enemies
                                        emojis = fakeMap.emojisUsed
                                        emojilinks = []
                                        for (let i = 0; i < 16; i++) {
                                            var emoji = emojis[i] || "potatoAndBanana"
                                            var str;
                                            if (emoji.startsWith('\\')){
                                                str = emoji
                                            }else{
                                                str = "\\" + emoji
                                            }
                                            emojilinks[i] = functions.getTwemojiLink(str) || "https://media.discordapp.net/attachments/747486528107708589/778637841969446962/unknown.png"
                                        }
    
                                        players.forEach(player => {
                                            player.X = fakeMap.startingPos.x
                                            player.Y = fakeMap.startingPos.y
                                        })
                                        var attachment = await functions.createDungeonMap(fakeMap, db, players, emojilinks, enemies)
                                        message.channel.send(attachment).then(lastMessage => {
                                            collector.message = lastMessage;
                                            newM.delete()
                                            newM = lastMessage
                                            lastMessage.react('⬆️')
                                                .then(() => lastMessage.react('⬅️'))
                                                .then(() => lastMessage.react('⬇️'))
                                                .then(() => lastMessage.react('➡️'))
                                                .then(() => lastMessage.react('⚔️'))
                                                .catch((e) => console.error('One of the emojis failed to react.', e));
                                        })
                                        collector2.stop()
                                        break;
                                
                                    default:
                                        break;
                                }
                            })
                        })
                        
                    }else{
                        collector.stop()
                    }
                }else{
    
    
                    console.log("Enemies: \n" + JSON.stringify(checkIfEnemiesHaveAllDied) + "\n Players: \n" + JSON.stringify(players))
                    setTimeout(() => {
                        console.log(newM.reactions.cache.size)
                        if(newM.reactions.cache.size >= 5){
                            message.channel.send(attachment).then(lastMessage => {
                                collector.message = lastMessage;
                                newM.delete()
                                newM = lastMessage
                                lastMessage.react('⬆️')
                                    .then(() => lastMessage.react('⬅️'))
                                    .then(() => lastMessage.react('⬇️'))
                                    .then(() => lastMessage.react('➡️'))
                                    .then(() => lastMessage.react('⚔️'))
                                    .catch((e) => console.error('One of the emojis failed to react.', e));
                            })
                        }
                        
                    }, 100);
                }
            })
    
            collector.on("end", async m => {
                newM.delete()
                var endEmbed = new Discord.MessageEmbed()
                    .setTitle("The game ended.")
                    .setThumbnail(functions.getTwemojiLink("❕"))
                if (m.reason != undefined) {
                    endEmbed.setDescription(m.reason)
                }
                message.channel.send(endEmbed).then(msg => {
                    msg.delete({ timeout: 10000 })
                })
                if (rewards.items.length < 1){
                    var displayedItems = ["Nothing."]
                }else{
                    var displayedItems = rewards.items.join("\n")
                }
                if(rewards.xp != 0){
                    var recapitulatif_theembed = new Discord.MessageEmbed()
                    .setTitle("Results")
                    .setDescription(`Money gained: **${rewards.money}** \n Experience gained: **${rewards.xp} XP** \n Objects obtained: **\n${displayedItems}**`)
                    message.channel.send(recapitulatif_theembed)
                    players.forEach(player => {
                        db.add(player.user + ".characters[0].stats.money", rewards.money)
                        db.add(player.user + ".characters[0].stats.xp", rewards.xp)
                        var currentlevel = db.get(player.user + ".characters[0].stats.level")
                        var currentxp = db.get(player.user + ".characters[0].stats.xp")
                        var currentSP = db.get(player.user + ".characters[0].stats.statPoints")
                        var currentHealth = db.get(player.user + ".characters[0].currentHealth")
                        var totalHealth = db.get(player.user + ".characters[0].stats.maxHealth")
                        if(currentxp >= currentlevel * 1000){
                            db.set(player.user + ".characters[0].stats.xp", currentxp - (currentlevel * 1000))
                            db.set(player.user + ".characters[0].stats.level", currentlevel + 1)
                            db.set(player.user + ".characters[0].stats.statPoints", currentSP + 2)
                            db.set(player.user + ".characters[0].stats.maxHealth", totalHealth + 2)
                            db.set(player.user + ".characters[0].currentHealth", currentHealth + 2)
                            message.channel.send(cLangJSON.hunt.result.levelUp + (currentlevel + 1) + " !")
                        }
                        rewards.items.forEach(item => {
                            db.push(player.user + ".characters[0].items", item)
                        })
                    })
                }
            })
        })
        
    }
}

async function tryToReact(message, emojis){
    try {
        emojis.forEach(async emoji => {
            await message.react(emoji)
        })
    } catch (e) {
        console.log(e)
        setTimeout(() => {tryToReact(message, emojis)}, 100)
    }
}
