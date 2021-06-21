const Discord = require('discord.js')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var RandomMessages = cLangJSON.ping.randomMessages;
    var PING = Date.now() - message.createdTimestamp
    var APIPING = Math.round(bot.ws.ping)
    var PINGembed = new Discord.MessageEmbed()
        .setTitle(RandomMessages[Math.floor(Math.random() * RandomMessages.length)])
        .setDescription(cLangJSON.ping.ping + PING + "ms\n" + cLangJSON.ping.APIping + APIPING + "ms.")
        .setColor("YELLOW")
    if(PING > 2000) {PINGembed.setColor("RED")}
    if(PING < 100) {PINGembed.setColor("GREEN")}
    if(PING < 10) {PINGembed.setColor("BLUE")}
    message.channel.send(PINGembed);
}