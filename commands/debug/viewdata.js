const Discord = require('discord.js')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    console.log(db.all())
    if(!message.author.id == '448560475987509268') return;
    console.log(args[1])
    var view;
    switch (args[0]) {
        case "serverMaps":
            view = serverMaps.get(args[1])
            break;
        case "bug":
            view = bug.get(args[1])
            break;
    
        default:
            view = db.get(args[1] || "*")
            break;
    }
    console.log(view)
    var dataEmbed = new Discord.MessageEmbed()
        .setTitle(args[1])
        .setDescription(view)
    message.channel.send(dataEmbed)
}