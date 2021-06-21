const Discord = require('discord.js');

exports.run = async (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    if(!message.author.id == '448560475987509268') return;
    if(args[0]){
        if(args[1] == "db" || !args[1]){
            db.delete(args[0])
        }else{
            serverMaps.delete(args[0])
        }
        message.channel.send("me to the data selected: https://i.imgflip.com/3e64wd.png")
    }
}