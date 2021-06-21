const Discord = require('discord.js')
var functions = require('./functions/Tools')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    message.channel.send("super mario in real life \n\n***SPAGHETTI*** \nhttps://www.youtube.com/watch?v=ZZalilnBdW0");
    functions.grantAchievement(message.author, "spaghet", db)
}

//pourquoi