const Discord = require('discord.js')

exports.run = async (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
        if (!db.get(message.author.id)) return message.channel.send(cLangJSON.notStarted.replace("&&", prefix))
        var User, UserID;
        if(message.mentions.users.first()){
            User = message.mentions.users.first()
            UserID = message.mentions.users.first().id
        }else{
            User = message.author;
            UserID = message.author.id
        }
        var page = Math.max(parseInt(args[0]) - 1, 0) || 0
        
        var ach_canvas = canvas.createCanvas(1024, 256)
        var ctx = ach_canvas.getContext("2d")
        //aight now this is the real shit
        var positions = [
            [2, 2],
            [204, 2],
            [406, 2],
            [608, 2],
            [810, 2],
        ]
        var textPlacement = [
            [102, 222],
            [304, 222],
            [506, 222],
            [708, 222],
            [910, 222],

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
        var achievementArray = db.get(UserID + ".achievements").slice(0 + (5*page), 5 + (5*page)) || [];

        var arrayDescription = []
        var embed = new Discord.MessageEmbed()
            .setTitle(cLangJSON.achievements.hisAchievements.replace("&&", User.tag))
            .setFooter("Page " + (page + 1) + "/" + Math.ceil(db.get(UserID + ".achievements").length/5))
            .setImage("attachment://achievements.png")
        if (achievementArray.length < 1){
            ctx.fillStyle = "#ffffff"
            ctx.font = '40px "Whitney"' 
            ctx.save();
            ctx.translate(ach_canvas.width/2, ach_canvas.height/2);
            ctx.rotate((-Math.PI/360)*25);
            ctx.textAlign = "center";
            ctx.fillText("This user doesn't have any achievements yet. F in the chat.", 0, 0)
            ctx.restore();
        }
        ctx.textAlign = "center"
        for (let i = 0; i < achievementArray.length; i++) {
            var element = achievementArray[i];
            console.log(element)
            var achievementData = achievements.find((x) => x.id == element)
            var name, description;
            if (cLangJSON.id == "fr"){
                name = achievementData.FRname
                description = achievementData.FRdescription
            }else{
                name = achievementData.ENname
                description = achievementData.ENdescription
            }
            var achievementColorStroke = colors.stroke[rarityvalues.indexOf(achievementData.tier)]
            var achievementColorFill = colors.background[rarityvalues.indexOf(achievementData.tier)]
            var achievementIconLink = getTwemojiLink("\\" + achievementData.image)
            var achievementIcon = await canvas.loadImage(achievementIconLink)
            ctx.fillStyle = achievementColorStroke
            ctx.font = applyText(ach_canvas, name, 824, 40)
            ctx.fillText(name, textPlacement[i][0], textPlacement[i][1])
            ctx.save();
            ctx.beginPath();
            ctx.arc(positions[i][0] + 100, positions[i][1] + 100, 90, 0, Math.PI * 2)
            ctx.closePath();
            ctx.strokeStyle = achievementColorStroke
            ctx.fillStyle = achievementColorFill
            ctx.lineWidth = 10
            ctx.clip();
            ctx.fill();
            ctx.stroke();
            ctx.drawImage(achievementIcon, positions[i][0] + 10, positions[i][1] + 10, 180, 180)
            ctx.stroke();
            ctx.restore();
            arrayDescription.push(`**${name}**: ${description}`)
        }
        embed.setDescription(arrayDescription.join('\n'))
        //send
        message.channel.send({
            embed: embed,
            files: [{
                attachment: ach_canvas.toBuffer(),
                name: 'achievements.png'
            }]
        });
}