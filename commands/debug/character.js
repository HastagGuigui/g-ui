const Discord = require('discord.js')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    if (!db.get(message.author.id)) return message.channel.send(cLangJSON.notStarted.replace("&&", prefix))
    var UserID;
    if(message.mentions.users.first()){
        UserID = message.mentions.users.first().id
    }else{
        UserID = message.author.id
    }

    console.log(UserID)
    var characterToGet = db.get(UserID)

    var charaEmbed = new Discord.MessageEmbed()
        .setTitle(cLangJSON.character.profile.replace("&&", characterToGet.characters[0].charactername))
        .setDescription(characterToGet.characters[0].description)
        .setThumbnail(characterToGet.characters[0].image)
        .addField(cLangJSON.character.stats.title, `${cLangJSON.character.stats.level} ${characterToGet.characters[0].stats.level} (${characterToGet.characters[0].stats.xp}/${characterToGet.characters[0].stats.level * 1000})\n ----------\n${cLangJSON.character.stats.health} ${characterToGet.characters[0].currentHealth}/${characterToGet.characters[0].stats.maxHealth} \n${cLangJSON.character.stats.strength} ${characterToGet.characters[0].stats.strength} \n${cLangJSON.character.stats.defense} ${characterToGet.characters[0].stats.defense} \n${cLangJSON.character.stats.speed} ${characterToGet.characters[0].stats.speed}\n----------\n${cLangJSON.character.stats.money} ${characterToGet.characters[0].stats.money}฿\n----------\n${cLangJSON.character.stats.ded} ${characterToGet.characters[0].stats.deaths || 0}`)
        .setFooter(cLangJSON.character.modify)
    message.channel.send(charaEmbed)

    str = JSON.stringify(characterToGet, null, 4);
    console.log(str);
}