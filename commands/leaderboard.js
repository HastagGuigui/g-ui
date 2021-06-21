const Discord = require('discord.js')
const functions = require('./functions/Tools')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var leaderboardJSON = functions.getLeaderboard(args[0], 10, db)
    var leaderboardEmbed = new Discord.MessageEmbed()
        .setTitle(cLangJSON.leaderboard.title)
        .setDescription(`Page ${leaderboardJSON.page}/${leaderboardJSON.total_pages}`)
        .setFooter(`Total: ${leaderboardJSON.total} ${cLangJSON.leaderboard.characters}`)
    var p = 1
    var guys = []
    leaderboardJSON.data.forEach(userData => {
        try {
            var thing = JSON.parse(userData.data)
        } catch (e) {
            var thing = userData.data
        }
        guys.push(
            { 
                name: `${p + (10 * (leaderboardJSON.page - 1))}: ${thing.characters[0].charactername}`,
                value: `${cLangJSON.leaderboard.level} ${thing.characters[0].stats.level} \n ${cLangJSON.leaderboard.xp} ${functions.abbreviate(thing.characters[0].stats.xp, 1, false, false)} XP \n \n ${cLangJSON.character.stats.title} \n ${cLangJSON.character.stats.strength} ${thing.characters[0].stats.strength} \n ${cLangJSON.character.stats.defense} ${thing.characters[0].stats.defense} \n ${cLangJSON.character.stats.speed} ${thing.characters[0].stats.speed}`,
                inline: true
            }
        )
        p++
    });
    leaderboardEmbed.addFields(guys)
    message.channel.send(leaderboardEmbed)
}