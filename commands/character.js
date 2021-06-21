const canvas = require('canvas');
var functions = require("./functions/Tools")
const achievements = require('../achievements.json');
const Discord = require('discord.js');
const twemoji_discord_stuff = require('node-canvas-with-twemoji-and-discord-emoji')

exports.run = async (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {

    if (!db.get(message.author.id)) return message.channel.send(cLangJSON.notStarted.replace("&&", prefix))
    var User, UserID;
    if(args[0]){
        if(message.mentions.users.first()){
            User = message.mentions.users.first()
            UserID = message.mentions.users.first().id
        }else{
            User = bot.users.cache.get(args[0])
            UserID = args[0]
        }
    }else{
        User = message.author;
        UserID = message.author.id
    }

    console.log(UserID)
    var characterToGet = db.get(UserID)


    var characterCanvas = canvas.createCanvas(1024, 1024)
    var ctx = characterCanvas.getContext('2d');
    ctx.beginPath();
    ctx.rect(0,0, 1024,1024);
    ctx.fillStyle = "#2C2F33"
    ctx.fill();
    


    ctx.font = functions.applyText(characterCanvas, characterToGet.characters[0].charactername, 300, 90) 
    ctx.fillStyle = '#7289DA'
    ctx.beginPath();
    ctx.rect(766, 2, 256, 256)
    ctx.closePath();
    ctx.fill();
    twemoji_discord_stuff.fillTextWithTwemoji(ctx, characterToGet.characters[0].charactername, 10, 100)
    ctx.fillStyle = "#ffffff"
    ctx.font = '30px "Whitney"'
    ctx.fillText(`${cLangJSON.character.creator} ${User.tag}`, 20, 150)
    var characterImage = db.get(UserID + ".characters[0].image")
    try {
        var characterPFP = await canvas.loadImage(characterImage)
    } catch (e) {
        var characterPFP = await canvas.loadImage("https://media.discordapp.net/attachments/747486528107708589/778637841969446962/unknown.png")
    }
    var OtherX,OtherY;
    if(characterPFP.height > characterPFP.width){
        OtherY = characterPFP.width
        OtherX = characterPFP.width
    }else{
        OtherX = characterPFP.height
        OtherY = characterPFP.height
    }

    //description area
    ctx.beginPath();
    ctx.rect(0, 175, 765, 200)
    ctx.closePath();
    ctx.fillStyle = "#23272A"
    ctx.fill();
    ctx.fillStyle = "#ffffff"
    ctx.font = '40px "Whitney"'
    functions.printAt(ctx, characterToGet.characters[0].description, 1, 205, 42, 765)

    //achievements rectangle
    ctx.beginPath();
    ctx.rect(766, 258, 256, 764)
    ctx.closePath();
    ctx.fillStyle = "#99AAB5"
    ctx.fill();
    ctx.fillStyle = "#ffffff"
    ctx.fillText("Achievements", 768, 300, 764)
    //aight now this is the real shit
    var positions = [
        [768, 310],
        [851, 310],
        [934, 310],
        [768, 393],
        [851, 393],
        [934, 393],
        [768, 476],
        [851, 476],
        [934, 476],
        [768, 559],
        [851, 559],
        [934, 559],
        [768, 642],
        [851, 642],
        [934, 642],
        [768, 725],
        [851, 725],
        [934, 725],
    ]
    var rarityvalues = [
        "gold",
        "silver",
        "bronze",
        "regular"
    ]
    var colors = {
        stroke: [
            "#FFB300",
            "#C4C4C4",
            "#590F00",
            "#7289DA"
        ],
        background: [
            "#A37200",
            "#8A8A8A",
            "#290700",
            "#425080"
        ]
    }
    var achievementArray = db.get(UserID + ".achievements") || [];
    for (let i = 0; i < achievementArray.length; i++) {
        var element = achievementArray[i];
        var achievementData = achievements.find((x) => x.id == element)
        console.log(achievementData)
        var achievementColorStroke = colors.stroke[rarityvalues.indexOf(achievementData.tier)]
        var achievementColorFill = colors.background[rarityvalues.indexOf(achievementData.tier)]
        var achievementIconLink = functions.getTwemojiLink("\\" + achievementData.image)
        var achievementIcon = await canvas.loadImage(achievementIconLink)
        ctx.save();
        ctx.beginPath();
        ctx.arc(positions[i][0] + 40.5, positions[i][1] + 40.5, 40.5, 0, Math.PI * 2)
        ctx.closePath();
        ctx.strokeStyle = achievementColorStroke
        ctx.fillStyle = achievementColorFill
        ctx.lineWidth = 10
        ctx.clip();
        ctx.fill();
        ctx.stroke();
        ctx.drawImage(achievementIcon, positions[i][0], positions[i][1], 81, 81)
        ctx.stroke();
        ctx.restore();
    }

    //healthbar
    var heart;
    if(characterToGet.characters[0].currentHealth < 1){
        heart = functions.getTwemojiLink("\💔")
    }else{
        heart = functions.getTwemojiLink("\❤")
    }
    var heartIMG = await canvas.loadImage(heart)
    ctx.drawImage(heartIMG, 20, 400, 72, 72)
    ctx.beginPath();
    ctx.rect(100, 400, 600, 72)
    ctx.closePath()
    ctx.fillStyle = "#ff8080"
    ctx.fill();
    var percentage = Math.max(characterToGet.characters[0].currentHealth * 600 / characterToGet.characters[0].stats.maxHealth, 0)
    ctx.beginPath();
    ctx.rect(100, 400, percentage, 72)
    ctx.closePath();
    ctx.fillStyle = "#de2e43"
    ctx.fill();
    ctx.fillStyle = "#ffffff"
    ctx.strokeStyle = "#220000"
    ctx.textAlign = "center"
    ctx.fillText(characterToGet.characters[0].currentHealth + "/" + characterToGet.characters[0].stats.maxHealth + " hp", 400, 445)

    //xp bar
    ctx.beginPath();
    ctx.rect(20, 500, 680, 40);
    ctx.closePath();
    ctx.fillStyle = "#00A148"
    ctx.fill();
    var realX = characterToGet.characters[0].stats.xp
    var realY = characterToGet.characters[0].stats.level
    var x = functions.abbreviate(realX, 2, false, false)
    var y = functions.abbreviate(realY * 1000, 2, false, false)

    var percentage = (realX * 680) / (realY * 1000)
    ctx.beginPath();
    ctx.rect(20, 500, percentage, 40)
    ctx.closePath();
    ctx.fillStyle = "#00FF73"
    ctx.fill();
    ctx.fillStyle = "#ffffff"
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.font = '30px "Whitney"'
    ctx.textAlign = "left"
    ctx.strokeText(`${cLangJSON.character.level} ${realY}`, 22, 530)
    ctx.fillText(`${cLangJSON.character.level} ${realY}`, 22, 530)
    ctx.textAlign = "center"
    ctx.strokeText(x + "/" + y, 350, 530)
    ctx.fillText(x + "/" + y, 350, 530)
    ctx.textAlign = "right"
    ctx.strokeText(Math.floor(realX / (realY*10)) + "%", 698, 530)
    ctx.fillText(Math.floor(realX / (realY*10)) + "%", 698, 530) // donc voyons. Level: x; XP: y
    //y / (x*10)

    //stats moment + death number because f in the chat umu
    var statsIconsLink = {
        strength: functions.getTwemojiLink("\⚔"),
        defense: functions.getTwemojiLink("\🛡"),
        speed: functions.getTwemojiLink("\🏃‍♂️"),
        death: functions.getTwemojiLink("\☠")
    }
    var statsImage = {
        strength: await canvas.loadImage(statsIconsLink.strength),
        defense: await canvas.loadImage(statsIconsLink.defense),
        speed: await canvas.loadImage(statsIconsLink.speed),
        death: await canvas.loadImage(statsIconsLink.death),
    }
    ctx.drawImage(statsImage.strength, 20, 570, 72, 72)
    ctx.drawImage(statsImage.defense, 20, 650, 72, 72)
    ctx.drawImage(statsImage.speed, 20, 730, 72, 72)
    ctx.drawImage(statsImage.death, 25, 850, 72, 72)
    ctx.font = '40px "Whitney"'
    ctx.textAlign = "left"
    ctx.fillText(cLangJSON.character.level + " " + characterToGet.characters[0].stats.strength, 100, 616)
    ctx.fillText(cLangJSON.character.level + " " + characterToGet.characters[0].stats.defense, 100, 696)
    ctx.fillText(cLangJSON.character.level + " " + characterToGet.characters[0].stats.speed, 100, 776)
    var deathText = cLangJSON.character.death[1]
    if (characterToGet.characters[0].stats.deaths == 1) {
        deathText = cLangJSON.character.death[0]
    }

    ctx.fillText((characterToGet.characters[0].stats.deaths || 0) + " " + deathText, 105, 896)

    //monyee
    var moneyIcon = functions.getTwemojiLink("\💰")
    var moneyImg = await canvas.loadImage(moneyIcon)
    var moneyAbreviated = functions.abbreviate(characterToGet.characters[0].stats.money, 2, false, false)
    ctx.drawImage(moneyImg, 400, 580, 72, 72)
    ctx.fillText(moneyAbreviated + "฿", 480, 625)

    //oh and also
    ctx.font = '20px "Whitney"'
    ctx.fillText(cLangJSON.character.modify.replace('&&', prefix), 10, 1010)

    //avatar circle
    ctx.beginPath();
    ctx.arc(894, 128, 116, 0, Math.PI * 2, true);
    ctx.lineWidth = 20
    if(UserID == '448560475987509268'){
        
        var my_gradient = ctx.createLinearGradient(0, 0, 170, 170);
        my_gradient.addColorStop(0.5, "#EEEEFF");
        my_gradient.addColorStop(1, "#0000ff");
        ctx.strokeStyle = my_gradient
    }else{
        ctx.strokeStyle = "#ffffff"
    }
    ctx.clip();
    ctx.drawImage(characterPFP, 0, 0, OtherX, OtherY, 766, 2, 256, 256)
    ctx.stroke();

    var embed = new Discord.MessageEmbed()
        .setTitle(cLangJSON.character.title.replace("&&", characterToGet.characters[0].charactername))
        .setImage("attachment://profileCard.png")
    //send
    message.channel.send({
        embed: embed,
        files: [{
            attachment: characterCanvas.toBuffer(),
            name: 'profileCard.png'
        }]
    });
}