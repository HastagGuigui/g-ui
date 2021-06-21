const Discord = require('discord.js');
const functions = require('../functions/Tools')

exports.run = async (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    if (message.author.id != "448560475987509268") return;
    var user = bot.users.cache.get(args[0])
    if (!args[1]) return message.channel.send("No args[1]")
    functions.grantAchievement(user, args[1], db)
}