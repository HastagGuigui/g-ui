const Discord = require('discord.js')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {                
    if (!args[2]) return message.channel.send(cLangJSON.editchara.syntax.replace("&&", prefix))
    const wordInString = (s, word) => new RegExp('\\b' + word + '\\b', 'i').test(s);
    var bannedWords = ["_ _","penis","dick","pénis","vagina","pussy","vagin","bitch","pute","asshole","cul","bite","ass","nègre","nigger","boobs","seins","cunt","merde","fuck","putain","shit"];
    var triggerRemoval = false;
    var altArgs = args.slice(2).join(' ')
    bannedWords.forEach(funnyword => {
        if(wordInString(altArgs, funnyword)) return triggerRemoval = true;
    })
    if(triggerRemoval) return message.channel.send("The arguments contains at least one banned word. Please refrain from using those words.")
    var character = db.get(message.author.id + ".characters[" + args[0] + "]")
    if(!character) return message.channel.send(cLangJSON.editchara.notReal)
    switch (args[1]) {
        case "name":
            var newName = altArgs
            db.set(message.author.id + ".characters[" + args[0] + "].charactername", newName)
            message.channel.send(cLangJSON.editchara.name + newName + "**.")
        break;
    
        case "description":
            var newDescription = altArgs
            db.set(message.author.id + ".characters[" + args[0] + "].description", newDescription)
            message.channel.send(cLangJSON.editchara.description + newDescription + "**.")
        break;
    
        case "image":
            db.set(message.author.id + ".characters[" + args[0] + "].image", args[2])
            message.channel.send(cLangJSON.editchara.image + args[2])
        default:
            message.channel.send(cLangJSON.editchara.notValidParameter.replace("&&", args[1]))
            break;
    }
}