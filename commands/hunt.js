const Discord = require('discord.js')
const functions = require('./functions/Tools')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var modifier = {
        strength: db.get(message.author.id + ".characters[0].stats.strength"),
        defense: db.get(message.author.id + ".characters[0].stats.defense"),
        speed: db.get(message.author.id + ".characters[0].stats.speed"),
        boost: db.get(message.author.id + ".characters[0].xpBoost") * db.get(message.author.id + ".characters[0].xpBoost2") || 1
    }
    if (db.get(message.author.id + ".characters[0].currentHealth") <= 0) return message.channel.send(cLangJSON.move.ded)
    if (db.get(message.author.id + ".characters[0].lastUsed.hunt") + Math.floor(5000 / (modifier.speed + 1)) >= Date.now()) return message.channel.send(cLangJSON.move.cooldown)
    let customReplies = cLangJSON.hunt.customReplies
    var time = Date.now()
    var footer = "[placeholder]"
    var lastVoted = db.get(message.author.id + ".characters[0].lastVoted")
    var boostLaunch = db.get(message.author.id + ".characters[0].lastUsed.Boost")
    if (boostLaunch + 43200000 < time){
        db.set(message.author.id + ".characters[0].xpBoost2", 1)
        modifier.boost = db.get(message.author.id + ".characters[0].xpBoost") * db.get(message.author.id + ".characters[0].xpBoost2")
        footer = cLangJSON.hunt.footer.noVote
    }else{
        footer = cLangJSON.hunt.footer.vote + "x" + modifier.boost
    }
    if (lastVoted + 43200000 < time){
        db.set(message.author.id + ".characters[0].xpBoost", 1)
        modifier.boost = db.get(message.author.id + ".characters[0].xpBoost") * db.get(message.author.id + ".characters[0].xpBoost2")
        footer = cLangJSON.hunt.footer.noVote
    }else{
        footer = cLangJSON.hunt.footer.vote + "x" + modifier.boost
    }

    console.log(modifier)

    var TheReply = customReplies[Math.floor(Math.random() * customReplies.length)]
    var wonXP = Math.floor(((Math.random() * 100) * (modifier.strength + 1)) * modifier.boost)
    var wonMoney = Math.floor(((Math.random() * 100) * (modifier.strength + 1)) * modifier.boost)
    var currentlevel = db.get(message.author.id + ".characters[0].stats.level")
    var currentxp = db.get(message.author.id + ".characters[0].stats.xp")
    var currentSP = db.get(message.author.id + ".characters[0].stats.statPoints")
    var currentMoney = db.get(message.author.id + ".characters[0].stats.money")
    var currentHealth = db.get(message.author.id + ".characters[0].currentHealth")
    var totalHealth = db.get(message.author.id + ".characters[0].stats.maxHealth")
    var lostHP = Math.floor((Math.random() * (totalHealth * 1.01)) / (modifier.defense + 1))
    db.set(message.author.id + ".characters[0].stats.xp", currentxp + wonXP)
    db.set(message.author.id + ".characters[0].stats.money", currentMoney + wonMoney)
    db.set(message.author.id + ".characters[0].lastUsed.hunt", Date.now())
    db.set(message.author.id + ".characters[0].currentHealth", currentHealth - lostHP)
    if(currentlevel + 1 >= 5) functions.grantAchievement(message.author, "level5", db)
    var xpEmbed = new Discord.MessageEmbed()
        .setTitle(TheReply)
        .setDescription(cLangJSON.hunt.result.earned[0] + wonXP + cLangJSON.hunt.result.earned[3] + wonMoney + "฿ " + cLangJSON.hunt.result.earned[1] + lostHP + cLangJSON.hunt.result.earned[2])
        .setFooter(footer)
    message.channel.send(xpEmbed)
    if(currentxp + wonXP >= currentlevel * 1000){
        db.set(message.author.id + ".characters[0].stats.xp", (currentxp + wonXP) - (currentlevel * 1000))
        db.set(message.author.id + ".characters[0].stats.level", currentlevel + 1)
        db.set(message.author.id + ".characters[0].stats.statPoints", currentSP + 2)
        db.set(message.author.id + ".characters[0].stats.maxHealth", totalHealth + 2)
        db.set(message.author.id + ".characters[0].currentHealth", currentHealth + 2)
        message.channel.send(cLangJSON.hunt.result.levelUp + (currentlevel + 1) + " !")
    }
    if((currentHealth - lostHP) <= 0){
        var deathCount = db.get(message.author.id + ".characters[0].stats.deaths")
        if (!deathCount) {deathCount = 0};
        db.set(message.author.id + ".characters[0].stats.deaths", deathCount + 1)
        message.channel.send(cLangJSON.hunt.result.ded.replace("&&", prefix))
    }
}