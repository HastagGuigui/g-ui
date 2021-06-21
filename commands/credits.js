const Discord = require('discord.js')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var CreditsEmbed = new Discord.MessageEmbed()
        .setTitle("Thanks to those people for helping making G-UI possible.")
        .setColor("0x00aaff")
        .addField("Hosting the bot 24/24", `[Sori#6913](https://twitter.com/SoriFurry)`, true)
        .addField("Creating the profile picture", "[@Wanou_san on twitter](https://twitter.com/Wanou_san)", true)
        .addField("Helping for bugfixes n stuff", `Nyeh heh heh#9999 and EmilyTheLugia#4343`, true)
        .addField("Using this bot right now", "You!")
        .setFooter("and more coming soon...")
    message.channel.send(CreditsEmbed)
}