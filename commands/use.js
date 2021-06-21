const Discord = require('discord.js')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    if (db.get(message.author.id + ".characters[0].currentHealth") <= 0) return message.channel.send(cLangJSON.move.ded)
    if (!args[0]) return message.channel.send("No item to use. Please select one.")
    var inventory = db.get(message.author.id + ".characters[0].inventory")
    var item = args[0]
    var itemID = inventory.indexOf(item)
    if (!inventory.includes(item)) return message.channel.send("Wrong item.")
    switch (item) {
        case "placeholder":
            message.channel.send("*long beep*")
            message.channel.send("You won aFDg|KsUbH}/2l:t!")
            db.delete(message.author.id + "characters[0].inventory[" + itemID + "]")
            break;

        case "GlitchedBadge":
            message.channel.send("This does nothing. It doesn't remove itself.")
        break;

        case "boost2":
            message.channel.send("You used a boost x2! Your gains are now multiplied by 2!")
            db.set(message.author.id + ".characters[0].lastUsed.Boost", Date.now())
            db.set(message.author.id + ".characters[0].xpBoost2", 2)
            db.delete(message.author.id + "characters[0].inventory[" + itemID + "]")
        break;

        case "dungeon1":
            message.channel.send("Soon™")
        break;
        default:
            message.channel.send("This item doesn't have any purpose at the moment.")
        break;
    }
}