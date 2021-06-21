const Discord = require('discord.js')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    if (db.get(message.author.id + ".characters[0].currentHealth") <= 0) return message.channel.send(cLangJSON.move.ded)

    var ShopInstance = require("../shop.json")
    var ShopEmbed = new Discord.MessageEmbed()
        .setTitle(cLangJSON.shop.shopName)
        .setDescription(cLangJSON.shop.MoneyDisplay[0] + db.get(message.author.id + ".characters[0].stats.money") + cLangJSON.shop.MoneyDisplay[1])
        .setFooter(cLangJSON.shop.footer)
    ShopInstance.Main.forEach(object => {
        if(db.get(message.author.id + ".characters[0].stats.level") < object.levelRequired) return;
        var name, description;
        console.log(object)
        switch (cLangJSON.id) {
            case "en":
                name = object.ENname
                description = object.ENdescription
                break;

            case "fr":
                name = object.FRname
                description = object.FRdescription
                break;

            default:
                name = "ERROR: FAILED TO LOAD LANGUAGE"
                description = "Nothing else, we really failed. Ask the dev about this."
                break;
        }
        ShopEmbed.addField(
            name, description + " [" + object.value + "฿] \nID: " + object.CodeName
        )
        
    });
    message.channel.send(ShopEmbed)
}