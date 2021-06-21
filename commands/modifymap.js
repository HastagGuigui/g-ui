const Discord = require('discord.js')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send("Nope, you need to be able to modify the guild by itself so it can work! (Required permissions: Manage Guild)")
    var ConfirmationEmbed = new Discord.MessageEmbed().setColor("GREEN");
    var data = serverMaps.get(message.guild.id + ".map")
    switch (args[0]) {
        case "tile":
            if(!args[1]) return message.channel.send("Not enough arguments. See g/modifymap help to get the syntax.")
            var arrayMapPosition = args[1].split(";")
            var arrayPosition = args[2].split(";")
            var possibleIDs = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p"];
            var newTile = possibleIDs.indexOf(args[3])
            var Position = {
                mapX: parseInt(arrayMapPosition[0]),
                mapY: parseInt(arrayMapPosition[1]),
                X: parseInt(arrayPosition[0]),
                Y: parseInt(arrayPosition[1])
            }
            console.log(Position)
            var isCorrrectMap = (element) => element.id.x === Position.mapX && element.id.y === Position.mapY
            var ItemID = data.findIndex(isCorrrectMap)
            console.log(ItemID)
            var line = serverMaps.get(message.guild.id + ".map[" + ItemID + "].data[" + (Position.Y - 1) + "]")
            var arrayLine = line.split('')
            arrayLine[Position.X * 2] = args[3]
            
            serverMaps.set(message.guild.id + ".map[" + ItemID + "].data[" + (Position.Y - 1) + "]", arrayLine.join(''))
            ConfirmationEmbed.setTitle("Succesfully changed tile").setDescription("Tile " + Position.X + ";" + Position.Y + " in map " + Position.mapX + ";" + Position.mapY + " has been set to " + data[ItemID].emojisUsed[newTile] + " with success!")
            message.channel.send(ConfirmationEmbed)
            break;
            
        case "palette":
            var possibleIDs = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p"];
            var newTile = possibleIDs.indexOf(args[3])
            var arrayMapPosition = args[1].split(";")
            var Position = {
                mapX: parseInt(arrayMapPosition[0]),
                mapY: parseInt(arrayMapPosition[1]),
            }
            const isCorrrectMap2 = (element) => element.id.x === Position.mapX && element.id.y === Position.mapY
            var ItemID = data.findIndex(isCorrrectMap2)
            switch (args[2]) {
                case "edit":
                    var palette = serverMaps.get(message.guild.id + ".map[" + ItemID + "].emojisUsed[" + newTile + "]")
                    if (!palette) return message.channel.send("Nope, I can't edit something that doesn't exist!")
                    serverMaps.set(message.guild.id + ".map[" + ItemID + "].emojisUsed[" + newTile + "]", args[4])
                    ConfirmationEmbed.setTitle("Palette changed!").setDescription("The palette's tile " + args[3].toUpperCase() + " has been changed from " + palette + " to " + args[4] + " without any problems!")
                    message.channel.send(ConfirmationEmbed)
                break;

                case "add":
                    var PaletteArray = serverMaps.get(message.guild.id + ".map[" + ItemID + "].emojisUsed")
                    if (PaletteArray.length >= 16) return message.channel.send("Too much emojis in the palette... Remove some, please.");
                    serverMaps.push(message.guild.id + ".map[" + ItemID + "].emojisUsed", args[3])
                    ConfirmationEmbed.setTitle("Palette changed!").setDescription("Succesfully added " + args[3] + " at the ID **" + possibleIDs[PaletteArray.length].toUpperCase() + "** in the " + args[1] + " emoji palette!")
                    message.channel.send(ConfirmationEmbed)
                break;

                case "remove":
                    if (!serverMaps.get(message.guild.id + ".map[" + ItemID + "].emojisUsed[" + newTile + "]")) return message.channel.send("No reason to delete something that doesn't exist.")
                    ConfirmationEmbed.setTitle("Palette changed!").setDescription("Succesfully removed " + serverMaps.get(message.guild.id + ".map[" + ItemID + "].emojisUsed[" + newTile + "]") + " (ID: **" + args[3].toUpperCase() + "**)")
                    var PaletteArray = serverMaps.get(message.guild.id + ".map[" + ItemID + "].emojisUsed")
                    PaletteArray.splice(newTile, 1)
                    serverMaps.set(message.guild.id + ".map[" + ItemID + "].emojisUsed", PaletteArray)
                    message.channel.send(ConfirmationEmbed)
                break;

                case "view":
                    var PaletteArray = serverMaps.get(message.guild.id + ".map[" + ItemID + "].emojisUsed")
                    ConfirmationEmbed.setTitle("Emoji palette").setDescription("Use the IDs to add them to the map!")
                    var MapArray = serverMaps.get(message.guild.id + ".map[" + ItemID + "].data")
                    var MapArrayResplitted = MapArray.join(' ')
                    console.log(MapArrayResplitted)

                    for (let i = 0; i < PaletteArray.length; i++) {
                        var element = PaletteArray[i];
                        let count = MapArrayResplitted.split('').filter(x => x == possibleIDs[i]).length
                        ConfirmationEmbed.addField(possibleIDs[i].toUpperCase(), element + "\n (" + count + " utilisations)", true)
                    }
                    message.channel.send(ConfirmationEmbed)
                break;

                case "help":
                    ConfirmationEmbed
                        .setTitle("Help of g/modifymap palette")
                        .setDescription("Commands available:")
                        .addField(prefix+"modifymap palette <mapX>;<mapY> edit <tileID> <newEmoji>", "Changes the emoji registered at this specific tile ID")
                        .addField(prefix+"modifymap palette <mapX>;<mapY> add <newEmoji>", "Adds the emoji to the palette")
                        .addField(prefix+"modifymap palette <mapX>;<mapY> remove <tileID>", "Removes the tile from the palette")
                        .addField(prefix+"modifymap palette <mapX>;<mapY> view", "Displays all emojis used, as well as the number of times they are used.")
                        .addField(prefix+"modifymap palette <mapX>;<mapY> help", "Shows information about the commands here")
                    message.channel.send(ConfirmationEmbed)
                break;

                default:
                    ConfirmationEmbed.setColor("RED")
                        .setTitle("Error: bad syntax")
                        .setDescription("Commands available:")
                        .addField(prefix+"modifymap palette <mapX>;<mapY> edit <tileID> <newEmoji>", "Changes the emoji registered at this specific tile ID")
                        .addField(prefix+"modifymap palette <mapX>;<mapY> add <newEmoji>", "Adds the emoji to the palette")
                        .addField(prefix+"modifymap palette <mapX>;<mapY> remove <tileID>", "Removes the tile from the palette")
                        .addField(prefix+"modifymap palette <mapX>;<mapY> view", "Displays all emojis used, as well as the number of times they are used.")
                        .addField(prefix+"modifymap palette <mapX>;<mapY> help", "Shows information about the commands here")
                    message.channel.send(ConfirmationEmbed)
                break;
            }
        break;

        case "collisions":
            ConfirmationEmbed.setColor("RED")
                .setTitle("Error: bad syntax")
                .setDescription("Syntax: g/modifymap collisions <mapX>;<mapY> <tile> <true/false>")
            if (!args[3]){
                message.channel.send(ConfirmationEmbed)
            }else{
                var arrayMapPosition = args[1].split(";")
                var Position = {
                    mapX: parseInt(arrayMapPosition[0]),
                    mapY: parseInt(arrayMapPosition[1]),
                }
                const isCorrrectMap = (element) => element.id.x === Position.mapX && element.id.y === Position.mapY;
                var ItemID = data.findIndex(isCorrrectMap)
                var collisionArray = serverMaps.get(message.guild.id + ".map[" + ItemID + "].collisions");
                var newTile = collisionArray.indexOf(args[2])
                switch (args[3]) {
                    case "true": 
                        if (collisionArray.includes(args[2])) return message.channel.send("The collision for this block is already activated.");
                        collisionArray.push(args[2])
                        serverMaps.set(message.guild.id + ".map[" + ItemID + "].collisions", collisionArray)
                        ConfirmationEmbed.setColor("GREEN").setTitle("Succesfully changed collisions").setDescription("Succesfully activated the collision of " + args[2] + ".")
                    break;
                    case "false": 
                        if (!collisionArray.includes(args[2])) return message.channel.send("The collision for this block is already deactivated.");
                        collisionArray.splice(newTile, 1)
                        serverMaps.set(message.guild.id + ".map[" + ItemID + "].collisions", collisionArray)
                        ConfirmationEmbed.setColor("GREEN").setTitle("Succesfully changed collisions").setDescription("Succesfully removed the collision of " + args[2] + ".")
                    break;
                    default: message.channel.send(ConfirmationEmbed); break;
                }
            }
        break;

        case "zone":
            if(!args[1]) return message.channel.send("Not enough arguments. See g/modifymap help to get the syntax.")
            var arrayMapPosition = args[1].split(";")
            var Position = {
                mapX: parseInt(arrayMapPosition[0]),
                mapY: parseInt(arrayMapPosition[1]),
            }
            let isCorrrectMap3 = (element) => element.id.x === Position.mapX && element.id.y === Position.mapY;
            var ItemID = data.findIndex(isCorrrectMap3)
            switch (args[2]) {
                case "rename": 
                    var string = args.slice(3).join(' ')
                    serverMaps.set(message.guild.id + ".map[" + ItemID + "].title", string)
                    message.channel.send("Succesfully edited the name of the zone "+ args[1] + " to " + string + "!")
                break;
                
                case "add":
                    var currentMoney = db.get(message.author.id + ".characters[0].stats.money")
                    if (currentMoney < 10000) return message.channel.send("You don't have enough money, you need 1000฿")
                    if (itemID != -1) return message.channel.send("Nope, the zone already exists.")
                    serverMaps.push(message.guild.id + ".map", {
                        id:{
                            x:Position.mapX,
                            y:Position.mapY
                        },
                        title:"There is no name",
                        size:{
                            x:16,
                            y:8
                        },
                        emojisUsed:[
                            "🟧",
                            "⬛",
                            "🚪",
                            "🟩"
                        ],
                        collisions:[
                            "a"
                        ],
                        data:[
                            "a a b b b b b b b b b b b b a a ",
                            "a b b b b b b b b b b b b b b a ",
                            "b b b b b b b b b b b b b b b b ",
                            "b b b b b b b a a b b b b b b b ",
                            "b b b b b b b a a b b b b b b b ",
                            "b b b b b b b b b b b b b b b b ",
                            "a b b b b b b b b b b b b b b a ",
                            "a a b b b b b b b b b b b b a a "
                        ]
                    })
                break;
            
                default:
                    break;
            }
        break;

        case "help":
            ConfirmationEmbed
                .setTitle("Help of g/modifymap")
                .addField("g/modifymap tile <mapX>;<mapY> <X>;<Y> <newTile>", "Changes the tile at those coordinates")
                .addField("g/modifymap palette <mapX>;<mapY> <edit/add/remove/view> <other values, go check g/modifymap palette help>", "Changes this part of the palette")
                .addField("g/modifymap collisions <mapX>;<mapY> <tile> <true/false>", "Modify the map's collisions")
                .addField("g/modifymap help", "This is what you're reading")
            message.channel.send(ConfirmationEmbed)
        break;

        case "objects":
            if(!args[2]) return message.channel.send("Not enough arguments. See g/modifymap help to get the syntax.")
            var arrayMapPosition = args[1].split(";")
            switch (args[2]) {
                case "create":
                    var isCorrrectMapObj = (element) => element.id.x === parseInt(arrayMapPosition[0]) && element.id.y === parseInt(arrayMapPosition[1])
                    var ItemID = data.findIndex(isCorrrectMapObj)
                    var objectlist = serverMaps.get(message.guild.id + ".map[" + ItemID + "].objs")
                    if(objectlist == undefined) {
                        objectlist = []
                        serverMaps.set(message.guild.id + ".map[" + ItemID + "].objs", [])
                    }
                    if (objectlist.length >= 64) return message.channel.send("Whoops, you reached the maximum amount of elements in an area.");
                    var position = args[3].split(";")
                    position = [parseInt(position[0]), parseInt(position[1])]
                    var type = args[4]
                    var displayTile = args[5]
                    var metadata = JSON.parse(args[6])
                    var newObject = {
                        type : type,
                        specialOptions : metadata,
                        pos : position,
                        displayTile : displayTile
                    }
                    objectlist.push(newObject)
                    serverMaps.set(message.guild.id + ".map[" + ItemID + "].objs", objectlist)
                    console.log(serverMaps.get(message.guild.id + ".map[" + ItemID + "]"))
                    message.channel.send("Successfully added the object under the ID of " + (objectlist.length - 1) + " to this area!")
                    break;

                case "delete":
                    var isCorrrectMap = (element) => element.id.x === arrayMapPosition[0] && element.id.y === arrayMapPosition[1]
                    var ItemID = data.findIndex(isCorrrectMap)
                    var yes = serverMaps.get(message.guild.id + ".map[" + ItemID + "].objs")
                    yes.splice(args[3], 1)
                    serverMaps.set(message.guild.id + ".map[" + ItemID + "].objs", yes)
                    message.channel.send("Succesfully deleted the asked object.")
                    break;

                case "modify":
                    var isCorrrectMap = (element) => element.id.x === arrayMapPosition[0] && element.id.y === arrayMapPosition[1]
                    var ItemID = data.findIndex(isCorrrectMap)
                    var yes = serverMaps.get(message.guild.id + ".map[" + ItemID + "].objs")
                    var selectedItem = yes[parseInt(args[3])]
                    switch (args[3]) {
                        case "type":
                            serverMaps.set(message.guild.id + ".map[" + ItemID + "].objs[" + parseInt(args[3]) + "].type", args[4])
                            break;

                        case "pos":
                        case "position":
                            if(!args[4]) return message.channel.send("No information available at the moment")
                            serverMaps.set(message.guild.id + ".map[" + ItemID + "].objs[" + parseInt(args[3]) + "].pos", args[args.length-1].split(";"))
                            if(args[4] != args[1] && args[5]){
                                var deleto = yes.splice(parseInt(args[3]), 1)
                                serverMaps.set(message.guild.id + ".map[" + ItemID + "].objs", yes)
                                
                                var newLocation = args[4].split(";")
                                var isCorrrectMapIDK = (element) => element.id.x === newLocation[0] && element.id.y === newLocation[1]
                                var newItemID = data.findIndex(isCorrrectMapIDK)
                                serverMaps.push(message.guild.id + ".map[" + newItemID + "].objs", deleto)
                                message.channel.send("Succesfully moved tile to area "+args[4] + ", in position "+args[5])
                            }else{
                                //uhh nothing
                                message.channel.send("Succesfully moved tile to position "+args[4])
                            }
                        break;

                        case "metadata":
                            serverMaps.set(message.guild.id + ".map[" + ItemID + "].objs[" + parseInt(args[3]) + "].specialOptions", JSON.parse(args[4]))
                            message.channel.send("Changed metadata stuff to this stuff: "+args[4]+"... Yeah I should probably point out what does what...")
                        break;

                        case "tile":
                            serverMaps.set(message.guild.id + ".map[" + ItemID + "].objs[" + parseInt(args[3]) + "].displayTile", args[4])
                            message.channel.send("Changed object's emoji to "+ args[4]+".")
                        break;
                    
                        default:
                            break;
                    }
                    break;
            
                case "view":
                    var isCorrrectMap = (element) => element.id.x === parseInt(arrayMapPosition[0]) && element.id.y === parseInt(arrayMapPosition[1])
                    var ItemID = data.findIndex(isCorrrectMap)
                    var yes = serverMaps.get(message.guild.id + ".map[" + ItemID + "].objs")
                    var pageNumber = parseInt(args[3]) || 1
                    if(yes){
                        if(yes.length > 10){
                            var itemsToShow = yes.slice(10*(pageNumber-1), 10*pageNumber)
                        }else{
                            var itemsToShow = yes
                        }
                    }else{
                        yes = []
                        var itemsToShow = []
                    }
                    var embed_obj = new Discord.MessageEmbed()
                    .setTitle("Objects in area "+ args[1] +":")
                    .setFooter(yes.length+"/64 (Page "+pageNumber+")")
                    if(yes.length <= 16)embed_obj.setColor("BLUE")
                    if(yes.length > 16)embed_obj.setColor("GREEN")
                    if(yes.length > 32)embed_obj.setColor("YELLOW")
                    if(yes.length > 48)embed_obj.setColor("RED")
                    if(yes.length == 64)embed_obj.setDescription("You have reached object limit in this area! You can no longer add more objects.")
                    if(yes.length > 64)return message.channel.send("how ("+yes.length+"/64 objects)")
                    if(yes.length == 0)embed_obj.setDescription("There are no objects in this area.")
                    itemsToShow.forEach(h => {
                        embed_obj.addField(h.displayTile, h.type + " | " + h.pos + " | " + JSON.stringify(h.specialOptions))
                    });
                    message.channel.send(embed_obj)
                break;
                default:
                    break;
            }
        break;

        default:
            ConfirmationEmbed.setColor("RED")
                .setTitle("Error: bad syntax")
                .addField("g/modifymap tile <mapX>;<mapY> <X>;<Y> <newTile>", "Changes the tile at those coordinates")
                .addField("g/modifymap palette <mapX>;<mapY> <edit/add/remove/view> <other values, go check g/modifymap palette help>", "Changes this part of the palette")
                .addField("g/modifymap collisions <mapX>;<mapY> <tile> <true/false>", "Modify the map's collisions")
                .addField("g/modifymap help", "This is what you're reading")
            message.channel.send(ConfirmationEmbed)
            break;
    }
}