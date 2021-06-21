const canvas = require('canvas')
const Discord = require('discord.js')
var functions = require("../functions/Tools")
var dungeonAreas = require("../../dungeonAreas.json")

exports.run = async (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var dungeonTier = parseInt(args[0]) || 1
    var dungeonData = dungeonAreas.filter(x => x.dungeonTier == dungeonTier)
    var fakeMap = dungeonData[0]
    var players = []
    var rewards = {
        money: 0,
        xp: 0,
        items: []
    }
    var enemies = fakeMap.enemies
    var emojis = fakeMap.emojisUsed
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
        newM.react('⬆️')
            .then(() => newM.react('⬅️'))
            .then(() => newM.react('⬇️'))
            .then(() => newM.react('➡️'))
            .then(() => newM.react('⚔️'))
            .catch((e) => console.error('One of the emojis failed to react.', e));
        var possibleKeyActions = [
            "⬅️",
            "⬆️",
            "⬇️",
            "➡️",
            "⚔️",
            "🛑",
            "⏭"
        ]
        var filter = (reaction, user) => {
            return possibleKeyActions.includes(reaction.emoji.name) && user.id != bot.user.id;
        };
        var collector = newM.createReactionCollector(filter, {time: 600000})

        collector.on('collect', async (reaction, user) => {
            if (user.bot) return;
            if (!players.find(x => x.user == user.id) && db.get(user.id + ".characters")) {
                if (players.length <= 4){
                    var newPlayer = {
                        user: user.id,
                        X: fakeMap.startingPos.x,
                        Y: fakeMap.startingPos.y,
                        health: db.get(user.id + ".characters[0].currentHealth"),
                        maxHealth: db.get(user.id + ".characters[0].stats.maxHealth"),
                        strength: db.get(user.id + ".characters[0].stats.strength"),
                        defense: db.get(user.id + ".characters[0].stats.defense"),
                    }
                    players.push(newPlayer)
                    message.channel.send(`**${user.tag}** joined the game.`).then(joined => {
                        joined.delete({timeout: 1000})
                    })
                }else return message.channel.send(`Sorry ${user.tag}, you can't join, the game is full.`)
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
                default:
                    break;
            }
            collector.resetTimer()
            collector.empty()
            players[playerID] = player
            var attachment = await functions.createDungeonMap(fakeMap, db, players, emojilinks, enemies)
            enemies = functions.newEnemiesPosition(enemies, players, fakeMap)
            players = functions.damagePlayers(enemies, players)


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
                                    if (rewards.items.length < 1){
                                        var displayedItems = ["Nothing."]
                                    }else{
                                        var displayedItems = rewards.items.join("\n")
                                    }
                                    var recapitulatif_theembed = new Discord.MessageEmbed()
                                    .setTitle("Results")
                                    .setDescription(`Money gained: **${rewards.money}** \n Experience gained: **${rewards.xp} XP** \n Objects obtained: **\n${displayedItems}**`)
                                    message.channel.send(recapitulatif_theembed)
                                    players.forEach(player => {
                                        db.add(player.user + ".characters[0].stats.money", rewards.money)
                                        db.add(player.user + ".characters[0].stats.xp", rewards.xp)
                                        rewards.items.forEach(item => {
                                            db.push(player.user + ".characters[0].items", item)
                                        })
                                    })
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
                    console.log(rewards.items)
                    if (rewards.items.length < 1){
                        var displayedItems = ["Nothing."]
                    }else{
                        var displayedItems = rewards.items.join("\n")
                    }
                    var recapitulatif_theembed = new Discord.MessageEmbed()
                    .setTitle("Results")
                    .setDescription(`Money gained: **${rewards.money}** \n Experience gained: **${rewards.xp} XP** \n Objects obtained: **\n${displayedItems}**`)
                    message.channel.send(recapitulatif_theembed)
                    players.forEach(player => {
                        db.add(player.user + ".characters[0].stats.money", rewards.money)
                        db.add(player.user + ".characters[0].stats.xp", rewards.xp)
                        var currentxp = db.get(player.user + ".characters[0].stats.xp")
                        var currentlevel = db.get(player.user + ".characters[0].stats.level")
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
            }else{


                console.log("Enemies: \n" + JSON.stringify(checkIfEnemiesHaveAllDied) + "\n Players: \n" + JSON.stringify(players))
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
            var recapitulatif_theembed = new Discord.MessageEmbed()
            .setTitle("Results")
            .setDescription(`Money gained: **${rewards.money}** \n Experience gained: **${rewards.xp} XP** \n Objects obtained: **\n${displayedItems}**`)
            message.channel.send(recapitulatif_theembed)
            players.forEach(player => {
                db.add(player.user + ".characters[0].stats.money", rewards.money)
                db.add(player.user + ".characters[0].stats.xp", rewards.xp)
                var currentxp = db.get(player.user + ".characters[0].stats.xp")
                var currentlevel = db.get(player.user + ".characters[0].stats.level")
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
        })
    })
    //message.channel.send("Error: all the functions have all been moved to g/dungeon.")
}