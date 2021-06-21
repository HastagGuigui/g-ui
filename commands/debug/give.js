const Discord = require('discord.js');

exports.run = async (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    if(!message.author.id == '448560475987509268') return;
    var user = args[0]
    var item = args[1]
    var knownItems = require("./items.json").Items;
    function isCorrectItem(itemAsked) {
        return itemAsked.ID === item;
    }
    var ItemThings = knownItems.find(isCorrectItem)
    var realUser = bot.users.cache.get(args[0])
    if(db.get(user + ".language") == "french"){
        realUser.send("Vous avez reçu " + ItemThings.FRname + " de la part du développeur lui-même, #Guigui!")
    }else{
        realUser.send("You got " + ItemThings.ENname + " from the developer himself, #Guigui!")
    }
}