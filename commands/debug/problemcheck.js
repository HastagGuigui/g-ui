const Discord = require('discord.js');

exports.run = async (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var SimulatedMessage = {author:{id: message.author.id}, guild:{id: message.guild.id}};
    switch (args[0]) {
        case "user":
            SimulatedMessage.author.id = args[1]
            SimulatedMessage.author.avatarURL = bot.users.cache.get(args[1]).avatarURL
            break;

        case "server":
            SimulatedMessage.guild.id = args[1]
        break;

        default:
            break;
    }
    if(args[2] == "updatePFP") return db.set(message.author.id + ".characters[0].image", message.author.avatarURL({format: "jpeg"}));
    var problemsDetected = problemCheck(SimulatedMessage);
    if (problemsDetected) {
        message.channel.send("Problem found and fixed.")
    }
}