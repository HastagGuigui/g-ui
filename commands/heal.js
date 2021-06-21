const Discord = require('discord.js')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var lastUsed = db.get(message.author.id + ".characters[0].lastUsed.heal");
    console.log(lastUsed + " when it can be used |" + Date.now())
    if (lastUsed + 30000 >= Date.now()) return message.channel.send("Whoa! Calm down! Wait at least " + Math.floor(((lastUsed + 30000) - Date.now()) / 1000) + "seconds.")
    var totalHealth = db.get(message.author.id + ".characters[0].stats.maxHealth")
    db.set(message.author.id + ".characters[0].currentHealth", totalHealth)
    db.set(message.author.id + ".characters[0].lastUsed.heal", Date.now())
    message.channel.send("Succesfully healed.")
}