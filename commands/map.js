var functions = require("./functions/Tools")

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    if (!db.get(message.author.id)) return message.channel.send(cLangJSON.notStarted.replace("&&", prefix))
    if (!serverMaps.get(message.guild.id + ".playerPositions").find((askedItem) => askedItem.id === message.author.id)) serverMaps.push(message.guild.id + ".playerPositions", {
        id:message.author.id,
        X:7,
        Y:5,
        mapX:0,
        mapY:0
    })
    var UserList = serverMaps.get(message.guild.id + ".playerPositions")
    var data = serverMaps.get(message.guild.id + ".map")
    //get the emoji image (link)
    if(args[0]){
        var zoneArray = args[0].split(';')
        var zone = {
            X:parseInt(zoneArray[0]),
            Y:parseInt(zoneArray[1])
        }
        var player = undefined;
    }else{
        var userData = UserList.find((askedItem) => askedItem.id === message.author.id)
        var zone = { 
            X: userData.mapX,
            Y: userData.mapY,
        }
        var player = {
            X: userData.X,
            Y: userData.Y
        }
    }
    var isCorrrectMap = (element) => element.id.x === zone.X && element.id.y === zone.Y
    var ItemID = data.findIndex(isCorrrectMap)
    var emojis = serverMaps.get(message.guild.id + ".map[" + ItemID + "].emojisUsed")
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
    var theActualData = serverMaps.get(message.guild.id + ".map[" + ItemID + "]")
    var otherSprites = theActualData.objs || [/*{
        pos: [0,0],
        displayTile: "⬆"
    }*/]
    functions.GetImageMap(player, emojilinks, message, theActualData, db, otherSprites)
}