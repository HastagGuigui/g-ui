const Discord = require('discord.js')
const DBL = require('dblapi.js');
const important = require('../important.json');

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    const dbl = new DBL(important.DBLtoken, bot);
    var time = Date.now()
    dbl.hasVoted(message.author.id).then(voted => {
        setTimeout(() => {
            if (voted) {
                var lastVoted = db.get(message.author.id + ".characters[0].lastVoted")
                if (lastVoted + 43200000 > time) return message.channel.send("[already voted]")
                else {
                    message.channel.send(cLangJSON.vote.reward)
                    db.set(message.author.id + ".characters[0].lastVoted", time)
                    db.set(message.author.id + ".characters[0].xpBoost", 2)
                }
            }else{
                if (db.get(message.author.id + ".characters[0].xpBoost") == 2) {
                    db.set(message.author.id + ".characters[0].xpBoost", db.get(message.author.id + ".characters[0].xpBoost")/2)
                }
                var voteEmbed = new Discord.MessageEmbed()
                    .setTitle(cLangJSON.vote.noReward)
                    .addField(cLangJSON.vote.link, "["+ cLangJSON.vote.click +"](https://top.gg/bot/549294278149668874)")
                message.channel.send(voteEmbed)
            }
        }, 500);
    });
}