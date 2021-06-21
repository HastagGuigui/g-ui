const items = require("../shop.json")

exports.run = async (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    //message.channel.send("Whoops! You have to put the CD in your computer.\n \nhttps://www.youtube.com/watch?v=slwmJLaVrdE")
    var itemToBuy = args[0]
    var amount = parseInt(args[1]) || 1
    var ItemBeingBought = items.Main.find(x => x.CodeName == itemToBuy)
    var character = db.get(message.author.id + ".characters[0]")
    if(!ItemBeingBought || character.stats.level <= ItemBeingBought.levelRequired) return message.channel.send("We do not sell that here.")
    if (character.stats.money <= amount * ItemBeingBought.value) return message.channel.send("Sorry " + character.charactername +", I can't give credit! Come back when you're a little, hmm, richer!")
    db.subtract(message.author.id + ".characters[0].stats.money", amount * ItemBeingBought.value)
    for (let i = 0; i <= amount; i++) {
        db.push(message.author.id + ".characters[0].inventory", itemToBuy)
    }
    message.channel.send("Succesfully bought " + amount + "x " + ItemBeingBought.ENname)
}