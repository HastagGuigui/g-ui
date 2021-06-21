const Discord = require('discord.js')
const functions = require('./functions/Tools')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    if(!args[0]) return message.channel.send(cLangJSON.roll.syntax.replace("&&", prefix))
    if (args.length == 1){
        //regular or advanced path
        var dice = args[0].split('x')
        console.log(dice)
        var RolledStuff = functions.advancedRoll(dice)
        var Total = functions.getArraySum(RolledStuff.scores);
        var RolledEmbed = new Discord.MessageEmbed()
            .setTitle(message.author.tag + "'s roll(s)")
            .setDescription("Dice(s): "+ args[0])
            .addField("Results: ", RolledStuff.scores.join(', ') + "\n\n Final score: **" + Total + "/" + (RolledStuff.faces * RolledStuff.rolls) + "**")
        message.channel.send(RolledEmbed)
    }else{
        //what
        var basicStuff= {
            faces: [],
            rolls: [],
            calculatedMaximums: [],
            scores: []
        }
        args.forEach(diceData => {
            var dice = diceData.split('x')
            var NewRolls = functions.advancedRoll(dice)
            console.log(diceData + "|" + NewRolls)
            basicStuff.faces.push(NewRolls.faces)
            basicStuff.rolls.push(NewRolls.rolls||1)
            basicStuff.scores = basicStuff.scores.concat(NewRolls.scores)
        })
        var Total = functions.getArraySum(basicStuff.scores);
        for (let i = 0; i < basicStuff.faces.length; i++) {
            var Max = basicStuff.faces[i] * basicStuff.rolls[i];
            basicStuff.calculatedMaximums.push(Max);
            
        }
        var maxTotal = functions.getArraySum(basicStuff.calculatedMaximums);
        var RolledEmbed = new Discord.MessageEmbed()
            .setTitle(message.author.tag + "'s rolls")
            .setDescription("Dices: "+ args.join(', '))
            .addField("Results: ", basicStuff.scores.join(', ') + "\n\n Final score: **" + Total + "/" + maxTotal + "**")
        message.channel.send(RolledEmbed)
    }
}