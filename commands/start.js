const Discord = require('discord.js')
var functions = require("./functions/Tools")

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var hasAlreadyStarted = db.get(message.author.id + ".hasAlreadyStarted")
    if (hasAlreadyStarted == true) return message.channel.send("You already started! View your character with " + prefix + "character")
    var theGuyThatWillStart = message.author
    var FirstEmbed = new Discord.MessageEmbed()
        .setTitle(cLangJSON.start[0])
    theGuyThatWillStart.send(FirstEmbed)
    setTimeout(() => {
        FirstEmbed.setTitle(cLangJSON.start[1])
        theGuyThatWillStart.send(FirstEmbed)
        setTimeout(() => {
            FirstEmbed.setTitle(cLangJSON.start[2])
            theGuyThatWillStart.send(FirstEmbed)
            setTimeout(() => {
                FirstEmbed.setTitle(cLangJSON.start[3])
                theGuyThatWillStart.send(FirstEmbed)
                setTimeout(() => {
                    FirstEmbed.setTitle(cLangJSON.start[4] + prefix + cLangJSON.start[5])
                    theGuyThatWillStart.send(FirstEmbed)
                    setTimeout(() => {
                        FirstEmbed.setTitle(cLangJSON.start[6])
                        theGuyThatWillStart.send(FirstEmbed)
                        setTimeout(() => {
                            FirstEmbed.setTitle(cLangJSON.start[7])
                            theGuyThatWillStart.send(FirstEmbed)
                            setTimeout(() => {
                                FirstEmbed.setTitle(cLangJSON.start[8] + theGuyThatWillStart.username + cLangJSON.start[9] + prefix + cLangJSON.start[10])
                                theGuyThatWillStart.send(FirstEmbed)
                                setTimeout(() => {
                                    FirstEmbed.setTitle(cLangJSON.start[11] + prefix + cLangJSON.start[12] + prefix + cLangJSON.start[13])
                                    theGuyThatWillStart.send(FirstEmbed)
                                    functions.grantAchievement(theGuyThatWillStart, "justStarted", db)
                                    db.set(message.author.id, {
                                        hasAlreadyStarted: true,
                                        language: "english",
                                        characters : [
                                            {
                                                charactername: message.author.username,
                                                image: message.author.avatarURL({format: 'jpg'}),
                                                description: "[redacted]",
                                                currentHealth: 5,
                                                stats: {
                                                    level: 1,
                                                    xp: 0,
                                                    statPoints: 0,
                                                    strength: 0,
                                                    defense: 0,
                                                    speed: 0,
                                                    maxHealth: 5,
                                                    money: 0
                                                },
                                                lastUsed: {

                                                },
                                                inventory:[

                                                ]
                                            }
                                        ]
                                    });
                                }, 2000);
                            }, 2000);
                        }, 2000);
                    }, 2000);
                }, 2000);
            }, 4000);
        }, 2000);
    }, 2000);
    
}