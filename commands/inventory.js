const Discord = require('discord.js')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var page = parseInt(args[0]) || 1
    if (page < 1) page = 1;
    var knownItems = require("../items.json").Items;
    var inventory = db.get(message.author.id + ".characters[0].inventory")
    inventory.sort((a, b) => {
        function isCorrectItemA(item) {return item.ID === a;};function isCorrectItemB(item) {return item.ID === b;};
        knownItems.find(isCorrectItemA).ObjectImportance - knownItems.find(isCorrectItemB).ObjectImportance}
    );
    var pageContent = inventory.slice(10 * (page - 1), 10 * page)
    var InventoryEmbed = new Discord.MessageEmbed()
        .setTitle("Inventaire de "+ db.get(message.author.id + ".characters[0].charactername"))
        .setFooter("Page " + page + "/" + Math.ceil(inventory.length / 10))
    for (let i = 0; i < pageContent.length; i++) {
        console.log(pageContent[i])
        function isCorrectItem(item) {
            return item.ID === pageContent[i];
        }
        var ItemThings = knownItems.find(isCorrectItem)
        var title, desc;
        switch (cLangJSON.id) {
            case "en":
                title = ItemThings.ENname
                desc = ItemThings.ENdesc
                break;
            
            case "fr":
                title = ItemThings.FRname
                desc = ItemThings.FRdesc
                break;

            default:
                title = "ERROR: FAILED TO LOAD LANGUAGE"
                desc = "Nothing else, we really failed. Ask the dev about this."
                break;
        }
        console.log(ItemThings)
        InventoryEmbed.addField(title, desc + "\n[ID: " + ItemThings.ID + "]");
        
    }
    message.channel.send(InventoryEmbed)
}