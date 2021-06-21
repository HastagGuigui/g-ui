const Discord = require('discord.js')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    switch (args[0]) {
        case "french":
        case "français":
        case "fr":
            db.set(message.author.id + ".language", "french")
            message.channel.send("Langue du bot changée sur: Français.")
        break;

        case "english":
        case "anglais":
        case "en":
            db.set(message.author.id + ".language", "english")
            message.channel.send("Bot language changed to: English.")
        break;
    
        default:
            message.channel.send("Parameters accepted: french/français/fr|english/anglais/en")
        break;
    }
}