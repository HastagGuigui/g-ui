const Discord = require('discord.js');
const functions = require('../functions/Tools')

exports.run = async (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var MOTD = args.join(' ')
    bot.user.setActivity(`[#Guigui]: ${MOTD}`)
}