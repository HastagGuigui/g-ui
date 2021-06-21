const Discord = require('discord.js')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    if(!args[2]){
        var errorEmbed = new Discord.MessageEmbed()
            .setTitle("Error: bad syntax")
            .setDescription("Syntax: " + "g/editstats <characterID> (strength|defense|speed) <value>")
            .setColor("0x0000ff")
            .setFooter("yep you failed at writing this command... sorry.")
        return message.channel.send(errorEmbed);
    }
    var character = args[0]
    var statToEdit = db.get(`${message.author.id}.characters[${character}].stats.${args[1]}`)
    var value = parseInt(args[2])
    var currentSP = db.get(message.author.id + ".characters[" + character +"].stats.statPoints")
    var strength = db.get(message.author.id + ".characters[" + character +"].stats.strength")
    var defense = db.get(message.author.id + ".characters[" + character +"].stats.defense")
    var speed = db.get(message.author.id + ".characters[" + character +"].stats.speed")
    var alreadygiven = strength + defense + speed
    console.log(statToEdit)
    if (value + alreadygiven - statToEdit > currentSP) return message.channel.send("You don't have enough stat points! You only have " + (currentSP - alreadygiven) + " stat points unused.")
    if(statToEdit != undefined){
        if (args[1] != "strength" && args[1] != "defense" && args[1] != "speed") return message.channel.send("Good job, you were trying to manipulate this thing, right?")
        db.set(`${message.author.id}.characters[${character}].stats.${args[1]}`, value)
        message.channel.send(`Your **${args[1]}** is now at **${value}**!"`)
    }
}