const Discord = require('discord.js')
const fs = require('fs')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var dataToSave;
    switch (args[0]) {
        case "db":
            if (args[1]){
                dataToSave = db.get(args[1])
            }else{
                dataToSave = db.all();
            }
            break;

        case "serverMaps":
            if (args[1]){
                dataToSave = serverMaps.get(args[1])
            }else{
                dataToSave = serverMaps.all();
            }
            break;
        case "dungeons":
            if (args[1]){
                dataToSave = dungeons.get(args[1])
            }else{
                dataToSave = dungeons.all();
            }
            break;
        case "bug":
            if (args[1]){
                dataToSave = bug.get(args[1])
            }else{
                dataToSave = bug.all();
            }
            break;

    
        default:
            message.channel.send("Invalid args[0]")
            break;
    }
    var fileName = args[2] || Date()
    var dataString = JSON.stringify(dataToSave, null, 4)
    message.channel.send("me omw to create a json file to [the bot's source code folder]/debug/"+fileName+".json")
    fs.writeFile(__dirname + "/../../debug/"+fileName+".json", dataString, function(err) {
        if(err){
            console.error(err)
            message.channel.send("Something happened.")
        }
    })
}