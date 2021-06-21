const Discord = require('discord.js')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var id = parseInt(args[0]) - 1 || 0
    var patchnoteFile = require("../patchnote.json").illGetAUhhhhhh[id]
    var title, stuff;
    switch (cLangJSON.id) {
        case "en":
            title = patchnoteFile.english.title
            stuff = patchnoteFile.english.stuff
            break;
        
        case "fr":
            title = patchnoteFile.french.title
            stuff = patchnoteFile.french.stuff
            break;

        default:
            title = "ERROR: FAILED TO LOAD LANGUAGE"
            stuff = "Nothing else, we really failed. Ask the dev about this."
            break;
    }
    var patchnoteEmbed = new Discord.MessageEmbed()
        .setTitle(title + " [" + patchnoteFile.version + "]")
        .setDescription(stuff)
        .setColor("0xFFFF00")
    message.channel.send(patchnoteEmbed)
}