const Discord = require('discord.js')
const fs = require('fs');
const { join } = require('path');

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var test = []
    var location = args.slice(1, args.length - 1).join(" ")
    console.log(location)
    var data = JSON.parse(fs.readFileSync(__dirname + "/../../debug/"+location+".json"));
    switch (args[0]) {
        case "db":
            db.set(args[args.length-1] || message.author.id, data)
            break;
    
        default:
            return;
            break;
    }
}