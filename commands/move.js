const Discord = require('discord.js')
var functions = require("./functions/Tools")

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    if (db.get(message.author.id + ".characters[0].currentHealth") <= 0) return message.channel.send(cLangJSON.move.ded.replace("&&", prefix))
    if (db.get(message.author.id + ".characters[0].lastUsed.move") + 1000 >= Date.now()) return message.channel.send(cLangJSON.move.cooldown)
    if (!db.get(message.author.id)) return message.channel.send(cLangJSON.notStarted.replace("&&", prefix))
    if (!serverMaps.get(message.guild.id + ".playerPositions").find((askedItem) => askedItem.id === message.author.id)) serverMaps.push(message.guild.id + ".playerPositions", {
        id:message.author.id,
        X:7,
        Y:5,
        mapX:0,
        mapY:0
    })
    var UserList = serverMaps.get(message.guild.id + ".playerPositions")
    var areaList = serverMaps.get(message.guild.id + ".map")
    var ItemID = UserList.indexOf(UserList.find((askedItem) => askedItem.id === message.author.id))
    console.log(serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + ']'))
    var mapX = serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + ']').mapX
    var mapY = serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + ']').mapY
    var player = {
        X: serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + ']').X,
        Y: serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + ']').Y
    }
    var MapID = areaList.indexOf(areaList.find((askedItem) => askedItem.id.x === mapX && askedItem.id.y === mapY))
    console.log(message.author.tag + " : " + mapX + "_" + mapY + " | " + player.X + ";" + player.Y)
    var direction;
    switch (args[0]) {
        case "u":
        case "up":
            direction = 0
            var ifCanWalk = functions.ScanCollisions(message, mapX, mapY, player.X, player.Y - 1, serverMaps)
            if (ifCanWalk == true){
                serverMaps.set(message.guild.id + ".playerPositions[" + ItemID + '].Y', player.Y - 1)
                var shouldWeChangeZone = functions.ChangeZone(mapX, mapY, player.X, player.Y - 1)
                if (shouldWeChangeZone == 3){
                    serverMaps.set(message.guild.id + ".playerPositions[" + ItemID + '].mapY', mapY - 1)
                    serverMaps.set(message.guild.id + ".playerPositions[" + ItemID + '].Y', 8)
                }
                var mapX = serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + '].mapX')
                var mapY = serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + '].mapY')
                var player = {
                    X: serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + ']').X,
                    Y: serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + ']').Y
                }
            }
            break;

        case "d":
        case "down":
            direction = 1
            var ifCanWalk = functions.ScanCollisions(message, mapX, mapY, player.X, player.Y + 1, serverMaps)
            if (ifCanWalk == true){
                serverMaps.set(message.guild.id + ".playerPositions[" + ItemID + '].Y', player.Y + 1)
                var shouldWeChangeZone = functions.ChangeZone(mapX, mapY, player.X, player.Y + 1)
                if (shouldWeChangeZone == 4){
                    serverMaps.set(message.guild.id + ".playerPositions[" + ItemID + '].mapY', mapY + 1)
                    serverMaps.set(message.guild.id + ".playerPositions[" + ItemID + '].Y', 1)
                }
                var mapX = serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + '].mapX')
                var mapY = serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + '].mapY')
                var player = {
                    X: serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + ']').X,
                    Y: serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + ']').Y
                }
            }
            break;

        case "l":
        case "left":
            direction = 2
            var ifCanWalk = functions.ScanCollisions(message, mapX, mapY, player.X - 1, player.Y, serverMaps)
            if (ifCanWalk == true){
                serverMaps.set(message.guild.id + ".playerPositions[" + ItemID + '].X', player.X - 1)
                var shouldWeChangeZone = functions.ChangeZone(mapX, mapY, player.X - 1, player.Y)
                if (shouldWeChangeZone == 1){
                    serverMaps.set(message.guild.id + ".playerPositions[" + ItemID + '].mapX', mapX - 1)
                    serverMaps.set(message.guild.id + ".playerPositions[" + ItemID + '].X', 15)
                }
                var mapX = serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + '].mapX')
                var mapY = serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + '].mapY')
                var player = {
                    X: serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + ']').X,
                    Y: serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + ']').Y
                }
            }
            break;

        case "r":
        case "right":
            direction = 3
            var ifCanWalk = functions.ScanCollisions(message, mapX, mapY, player.X + 1, player.Y, serverMaps)
            if (ifCanWalk == true){
                serverMaps.set(message.guild.id + ".playerPositions[" + ItemID + '].X', player.X + 1)
                var shouldWeChangeZone = functions.ChangeZone(mapX, mapY, player.X + 1, player.Y)
                if (shouldWeChangeZone == 2){
                    serverMaps.set(message.guild.id + ".playerPositions[" + ItemID + '].mapX', mapX + 1)
                    serverMaps.set(message.guild.id + ".playerPositions[" + ItemID + '].X', 0)
                }
                var mapX = serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + '].mapX')
                var mapY = serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + '].mapY')
                var player = {
                    X: serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + ']').X,
                    Y: serverMaps.get(message.guild.id + ".playerPositions[" + ItemID + ']').Y
                }
            }
            break;
        default:
            message.channel.send(cLangJSON.move.syntax)
            break;
    }
    var MapID = areaList.indexOf(areaList.find((askedItem) => askedItem.id.x === mapX && askedItem.id.y === mapY))
    var objects = serverMaps.get(message.guild.id + ".map[" + MapID + "].emojisUsed")
    functions.CheckForSpecialTiles(objects, serverMaps, player);
    MapID = areaList.indexOf(areaList.find((askedItem) => askedItem.id.x === mapX && askedItem.id.y === mapY))
    var emojis = serverMaps.get(message.guild.id + ".map[" + MapID + "].emojisUsed")
    var emojilinks = []
    for (let i = 0; i < 16; i++) {
        var emoji = emojis[i] || "potatoAndBanana"
        var str;
        if (emoji.startsWith('\\')){
            str = emoji
        }else{
            str = "\\" + emoji
        }
        emojilinks[i] = functions.getTwemojiLink(str) || "https://media.discordapp.net/attachments/747486528107708589/775028473864650792/unknown.png"
        if(emoji.length > 7) {
            console.log("The emoji " + emoji + " is currently not supported. This might lead to some problems.")
        };

    }
    var theActualData = serverMaps.get(message.guild.id + ".map[" + MapID + "]")
    var otherSprites = theActualData.objs || [/*{
        pos: [0,0],
        displayTile: "⬆"
    }*/]
    functions.GetImageMap(player, emojilinks, message, theActualData, db, otherSprites)
    db.set(message.author.id + ".characters[0].lastUsed.move", Date.now())
}