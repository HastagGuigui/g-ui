const canvas = require('canvas');
const Discord = require('discord.js')
const twemoji = require('twemoji')
const html2json = require('html2json').html2json;
var defaultMap = require("../../defaultMap.json");
const twemoji_discord_stuff = require('node-canvas-with-twemoji-and-discord-emoji');

module.exports = {
    GetImageMap: async function (player, emojilinks, message, theActualData, db, otherSprites) {
        var map = theActualData.data

        var size = theActualData.size
    
        //C to the A to the N to the V to the A to the S
        var theCanvas = canvas.createCanvas(73*size.x-1, 73*size.y+99)
        var ctx = theCanvas.getContext('2d')
        ctx.beginPath();
        ctx.rect(0,0,theCanvas.width,theCanvas.height);
        ctx.fillStyle = "#2C2F33"
        ctx.fill();
        ctx.font = '32px "Whitney"'
        ctx.fillStyle = '#ffffff'
    
        //load character image for better shit
        var characterImage = db.get(message.author.id + ".characters[0].image")
        try {
            var character = await canvas.loadImage(characterImage)
        } catch (e) {
            var character = await canvas.loadImage("https://media.discordapp.net/attachments/747486528107708589/778637841969446962/unknown.png")
        }
        console.log("Number of objects: " + otherSprites.length)
    
        //haha canvas.loadImage().then() go brrrr
        var image_a = await canvas.loadImage(emojilinks[0])
        var image_b = await canvas.loadImage(emojilinks[1])
        var image_c = await canvas.loadImage(emojilinks[2])
        var image_d = await canvas.loadImage(emojilinks[3])
        var image_e = await canvas.loadImage(emojilinks[4])
        var image_f = await canvas.loadImage(emojilinks[5])
        var image_g = await canvas.loadImage(emojilinks[6])
        var image_h = await canvas.loadImage(emojilinks[7])
        var image_i = await canvas.loadImage(emojilinks[8])
        var image_j = await canvas.loadImage(emojilinks[9])
        var image_k = await canvas.loadImage(emojilinks[10])
        var image_l = await canvas.loadImage(emojilinks[11])
        var image_m = await canvas.loadImage(emojilinks[11])
        var image_n = await canvas.loadImage(emojilinks[11])
        var image_o = await canvas.loadImage(emojilinks[12])
        var image_p = await canvas.loadImage(emojilinks[13])
        for (let y = 0; y < size.y; y++) {
            var lineData = map[y].split(' ')
            for (let x = 0; x < size.x; x++) {
                switch (lineData[x]) {
                    case "a":ctx.drawImage(image_a, 73*x, 73*y, 72, 72);break;
                    case "b":ctx.drawImage(image_b, 73*x, 73*y, 72, 72);break;
                    case "c":ctx.drawImage(image_c, 73*x, 73*y, 72, 72);break;
                    case "d":ctx.drawImage(image_d, 73*x, 73*y, 72, 72);break;
                    case "e":ctx.drawImage(image_e, 73*x, 73*y, 72, 72);break;
                    case "f":ctx.drawImage(image_f, 73*x, 73*y, 72, 72);break;
                    case "g":ctx.drawImage(image_g, 73*x, 73*y, 72, 72);break;
                    case "h":ctx.drawImage(image_h, 73*x, 73*y, 72, 72);break;
                    case "i":ctx.drawImage(image_i, 73*x, 73*y, 72, 72);break;
                    case "j":ctx.drawImage(image_j, 73*x, 73*y, 72, 72);break;
                    case "k":ctx.drawImage(image_k, 73*x, 73*y, 72, 72);break;
                    case "l":ctx.drawImage(image_l, 73*x, 73*y, 72, 72);break;
                    case "m":ctx.drawImage(image_m, 73*x, 73*y, 72, 72);break;
                    case "n":ctx.drawImage(image_n, 73*x, 73*y, 72, 72);break;
                    case "o":ctx.drawImage(image_o, 73*x, 73*y, 72, 72);break;
                    case "p":ctx.drawImage(image_p, 73*x, 73*y, 72, 72);break;
                }
            }
        }
        for (let i = 0; i < otherSprites.length; i++) {
            var sprite = otherSprites[i];
            var img_asset = await canvas.loadImage(this.getTwemojiLink(sprite.displayTile))
            console.log(sprite)
            //  ^ I legit thought of naming this "img_ass"
            ctx.drawImage(img_asset, 73*sprite.pos[0], 73*sprite.pos[1], 72, 72)
            
        }
        if(player){
            var OffsetX,OffsetY,OtherX,OtherY;
            if(character.height > character.width){
                OtherY = 72
                OtherX = character.width * 72 / character.height
                OffsetX = (72 - OtherX) / 2
                OffsetY = 0
            }else{
                OtherX = 72
                OtherY = character.height * 72 / character.width
                OffsetY = (72 - OtherY) / 2
                OffsetX = 0
            }
            ctx.drawImage(character, 73*player.X + OffsetX, 73*(player.Y - 1) + OffsetY, OtherX, OtherY);
            ctx.textAlign = "end";
            ctx.fillText("Coordinates:" + player.X + ";" + player.Y, 73*size.x-2, 73*size.y+40)
        }
        var mapName = theActualData.title
        ctx.textAlign = "start";
        ctx.fillText(mapName, 1, 73*size.y+40)
        var attachment = new Discord.MessageAttachment(theCanvas.toBuffer(), 'map.png');
        message.channel.send(attachment)
        
    },
    getTwemojiLink: function (emoji, bot){
        if(emoji.startsWith("<")){
            var regexp = new RegExp(/([1-9]+([^A-z]))\w+/g)
            var link = `https://cdn.discordapp.com/emojis/${regexp.exec(emoji)[1]}.png`
            if (!link) link = "this won't load"
        }else{
            var text = twemoji.parse(emoji);
            json = html2json(text);
            if(!json.child[json.child.length - 1].attr) return undefined;
            var link = json.child[json.child.length - 1].attr.src;
        }
        return link;
    },
    applyText: function (that_canvas, text, desiredOffset, fontSize){
        const ctx = that_canvas.getContext('2d');
    
        do {
            // Assign the font to the context and decrement it so it can be measured again
            ctx.font = `${fontSize -= 2}px 'Whitney'`;
            // Compare pixel width of the text to the canvas minus the approximate avatar size
        } while (twemoji_discord_stuff.measureText(ctx, text).width > that_canvas.width - desiredOffset);
        
    
        // Return the result to use in the actual canvas
        return ctx.font;
    },
    abbreviate: function (number, maxPlaces, forcePlaces, forceLetter){
        number = Number(number)
        forceLetter = forceLetter || false
        if(forceLetter !== false) {
            return annotate(number, maxPlaces, forcePlaces, forceLetter)
        }
        var abbr
        if(number >= 1e12) {
            abbr = 'T'
        }
        else if(number >= 1e9) {
            abbr = 'B'
        }
        else if(number >= 1e6) {
            abbr = 'M'
        }
        else if(number >= 1e3) {
            abbr = 'K'
        }
        else {
            abbr = ''
        }
        return this.annotate(number, maxPlaces, forcePlaces, abbr)
    },
    annotate: function (number, maxPlaces, forcePlaces, abbr){
        // set places to false to not round
        var rounded = 0
        switch(abbr) {
            case 'T':
                rounded = number / 1e12
                break;
            case 'B':
                rounded = number / 1e9
                break;
            case 'M':
                rounded = number / 1e6
                break;
            case 'K':
                rounded = number / 1e3
                break;
            case '':
                rounded = number
                break;
        }
        if(maxPlaces !== false) {
          var test = new RegExp('\\.\\d{' + (maxPlaces + 1) + ',}$')
          if(test.test(('' + rounded))) {
            rounded = rounded.toFixed(maxPlaces)
          }
        }
        if(forcePlaces !== false) {
          rounded = Number(rounded).toFixed(forcePlaces)
        }
        return rounded + abbr
    },
    ScanCollisions: function (message, MapX, MapY, X, Y, serverMaps) {
        try {
            function isCorrectArea(askedItem) {
                return askedItem.id.x === MapX && askedItem.id.y === MapY
            }
            var area = serverMaps.get(message.guild.id + ".map").find(isCorrectArea)
            var areaArray = area.data
            var collisions = area.collisions
            if (areaArray[Y - 1]){
                var actualLine = areaArray[Y - 1].split('')
                if (collisions.indexOf(actualLine[X * 2]) != -1) {
                    if(0<X<17){
                        return false;
                    }
                }else return true;
            }else{
                return true;
            }
        } catch (e) {
            console.error(e)
            message.channel.send("TU FOUS QUOI EN DEHORS DES LIMITES PTN")
        }
        
    },
    CheckForSpecialTiles: function (objects, serverMaps, player){

    },
    ChangeZone: function(MapX, MapY, X, Y) {
        if(X <= -1){
            console.log("1")
            return 1;
        }else if(X >= 16){
            console.log("2")
            return 2;
        }
        if(Y <= 0){
            console.log("3")
            return 3;
        }else if(Y >= 9){
            console.log("4")
            return 4;
        }
    },
    grantAchievement: function(user, achievement_code, db){
        if(!db.get(user.id + ".achievements")){
            db.set(user.id + ".achievements", [])
        }
        if(db.get(user.id + ".achievements").find(x => x == achievement_code)) return;
        db.push(user.id + ".achievements", achievement_code)
        const achievements = require('../../achievements.json')
        var realStuff = achievements.find(x => x.id == achievement_code)
        if (!realStuff) return;
        var achievementGetEmbed = new Discord.MessageEmbed()
            .setTitle("You got a new achievement!")
            .addField("Achievement: **"+realStuff.name+"**", realStuff.description)
            .setColor("0x00FF00")
        user.send(achievementGetEmbed)
    },
    makeid: function(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    advancedRoll: function(array) {
        if (array.length == 1){
            var Rolled = Math.floor(Math.random() * (parseInt(array[0]) - 1)) + 1
            return {
                faces: parseInt(array[0]),
                rolls: 1,
                scores: [
                    Rolled
                ]
            };
        }else if (array.length == 2){
            var numberOfRolls = parseInt(array[0])
            var Rolled = [];
            for (let i = 0; i < numberOfRolls; i++) {
                Rolled[i] = Math.floor(Math.random() * (parseInt(array[1]) - 1)) + 1
            } 
            return {
                faces: parseInt(array[1]),
                rolls: numberOfRolls,
                scores: Rolled
            };
        }else return "Something went wrong.";
    },
    getArraySum: function(a){
        var total=0;
        for(var i in a) { 
            total += a[i];
        }
        return total;
    },
    getLeaderboard: function(page, per_page, db) {
        // Get all data not sorted
        const resp = db.all().filter(x => {
            if (x.data.characters != undefined){
                return x.data.characters[0].charactername != undefined;
            }else return false;
        })
        console.log(resp[0].data)
        // Sort from higher to lower
        resp.sort((a, b) => {
            var varA = a.data
            var varB = b.data
            var comparisonA = ((varA.characters[0].stats.level) * 10000000) + varA.characters[0].stats.xp
            var comparisonB = ((varB.characters[0].stats.level) * 10000000) + varB.characters[0].stats.xp
            return comparisonB - comparisonA;
        });

        /* Pagination: copy the code from last example */
        var page = page || 1,
        per_page = per_page || 10,
        offset = (page - 1) * per_page,

        paginatedItems = resp.slice(offset).slice(0, per_page),
        total_pages = Math.ceil(resp.length / per_page);
        let end = {
            page: page,
            per_page: per_page,
            pre_page: page - 1 ? page - 1 : null,
            next_page: (total_pages > page) ? page + 1 : null,
            total: resp.length,
            total_pages: total_pages,
            data: paginatedItems
        };
    
        // RESULT
        return end;
    },
    problemCheck: function(message, db, serverMaps){
        if (db.get(message.author.id + ".characters[0].stats.money") == undefined && db.get(message.author.id + ".characters[0].charactername")) {
            db.set(message.author.id + ".characters[0].stats.money", 500)
            return true;
        }
        if (db.get(message.author.id + ".characters[0].image") && db.get(message.author.id + ".characters[0].image").endsWith(".webp")){
            db.set(message.author.id + ".characters[0].image", message.author.avatarURL({format: "jpeg"}))
            return true;
        }
        if (db.get(message.author.id + ".characters[0].xpBoost2") == undefined && db.get(message.author.id + ".characters[0].charactername")){
            db.set(message.author.id + ".characters[0].xpBoost2", 1)
            return true;
        }
        if (db.get(message.author.id + ".characters[0].stats.xp") == null && db.get(message.author.id + ".characters[0].charactername")){
            db.set(message.author.id + ".characters[0].stats.xp", 1)
            return true;
        }
        if (!serverMaps.get(message.guild.id)) {
            serverMaps.set(message.guild.id, defaultMap)
            return true;
        }
        if (serverMaps.get(message.guild.id + ".map[0].collisions") == undefined && serverMaps.get(message.guild.id + ".map[0]")){
            serverMaps.set(message.guild.id, defaultMap)
            return true;
    }},
    printAt: function( context , text, x, y, lineHeight, fitWidth)
    {
        fitWidth = fitWidth || 0;
        
        if (fitWidth <= 0)
        {
            twemoji_discord_stuff.fillTextWithTwemoji(context, text, x, y)
            return;
        }

        var realText = text.replace(/ *\<[^)]*\> */g, "#")
        
        for (var i = 1; i <= realText.length; i++)
        {
            var str = realText.substr(0, i);
            console.log(str, twemoji_discord_stuff.measureText(context, str).width, fitWidth);
            if (twemoji_discord_stuff.measureText(context, str).width > fitWidth)
            {
                twemoji_discord_stuff.fillTextWithTwemoji(context, text.substr(0, i-1), x, y)
                this.printAt(context, text.substr(i-1), x, y + lineHeight, lineHeight,  fitWidth);
                return;
            }
        }
        twemoji_discord_stuff.fillTextWithTwemoji(context, text, x, y)
    },
    createDungeonMap: async function(theActualData, db, players, emojilinks, enemies){
        var alreadyPreparedCanvas = canvas.createCanvas(73*theActualData.size.x-1, 73*theActualData.size.y+99)
        var ctx = alreadyPreparedCanvas.getContext("2d")
        var map = theActualData.data
    
        var size = theActualData.size
    
        //C to the A to the N to the V to the A to the S
        var theCanvas = canvas.createCanvas(73*size.x-1, 73*size.y+99)
        var ctx = theCanvas.getContext('2d')
        ctx.beginPath();
        ctx.rect(0,0,theCanvas.width,theCanvas.height);
        ctx.fillStyle = "#2C2F33"
        ctx.fill();
        ctx.font = '32px "Whitney"'
        ctx.fillStyle = '#ffffff'
    
        //haha canvas.loadImage().then() go brrrr
        var image_a = await canvas.loadImage(emojilinks[0])
        var image_b = await canvas.loadImage(emojilinks[1])
        var image_c = await canvas.loadImage(emojilinks[2])
        var image_d = await canvas.loadImage(emojilinks[3])
        var image_e = await canvas.loadImage(emojilinks[4])
        var image_f = await canvas.loadImage(emojilinks[5])
        var image_g = await canvas.loadImage(emojilinks[6])
        var image_h = await canvas.loadImage(emojilinks[7])
        var image_i = await canvas.loadImage(emojilinks[8])
        var image_j = await canvas.loadImage(emojilinks[9])
        var image_k = await canvas.loadImage(emojilinks[10])
        var image_l = await canvas.loadImage(emojilinks[11])
        var image_m = await canvas.loadImage(emojilinks[12])
        var image_n = await canvas.loadImage(emojilinks[13])
        var image_o = await canvas.loadImage(emojilinks[14])
        var image_p = await canvas.loadImage(emojilinks[15])
    
        for (let y = 0; y < size.y; y++) {
                var lineData = map[y].split(' ')
                for (let x = 0; x < size.x; x++) {
                    switch (lineData[x]) {
                        case "a":ctx.drawImage(image_a, 73*x, 73*y, 72, 72);break;
                        case "b":ctx.drawImage(image_b, 73*x, 73*y, 72, 72);break;
                        case "c":ctx.drawImage(image_c, 73*x, 73*y, 72, 72);break;
                        case "d":ctx.drawImage(image_d, 73*x, 73*y, 72, 72);break;
                        case "e":ctx.drawImage(image_e, 73*x, 73*y, 72, 72);break;
                        case "f":ctx.drawImage(image_f, 73*x, 73*y, 72, 72);break;
                        case "g":ctx.drawImage(image_g, 73*x, 73*y, 72, 72);break;
                        case "h":ctx.drawImage(image_h, 73*x, 73*y, 72, 72);break;
                        case "i":ctx.drawImage(image_i, 73*x, 73*y, 72, 72);break;
                        case "j":ctx.drawImage(image_j, 73*x, 73*y, 72, 72);break;
                        case "k":ctx.drawImage(image_k, 73*x, 73*y, 72, 72);break;
                        case "l":ctx.drawImage(image_l, 73*x, 73*y, 72, 72);break;
                        case "m":ctx.drawImage(image_m, 73*x, 73*y, 72, 72);break;
                        case "n":ctx.drawImage(image_n, 73*x, 73*y, 72, 72);break;
                        case "o":ctx.drawImage(image_o, 73*x, 73*y, 72, 72);break;
                        case "p":ctx.drawImage(image_p, 73*x, 73*y, 72, 72);break;
                    }
                }
        }
    
        try {
            for (let i = 0; i < enemies.length; i++) { //the enemies bein rendered
                if (enemies[i].health > 0) {
                    var image = await canvas.loadImage(this.getTwemojiLink(enemies[i].emoji));
                    ctx.drawImage(image, 73*enemies[i].X, 73*enemies[i].Y, 72, 72)
                    var possibleHealthColors = [
                        "#FF0000",
                        "#FFFF00",
                        "#00FF00",
                        "#00FFFF"
                    ]
                    var healthColorID = parseInt((3 / enemies[i].maxHealth) * enemies[i].health)
                    ctx.fillStyle = possibleHealthColors[healthColorID]
                    ctx.strokeStyle = "#000000"
                    ctx.lineWidth = 1
                    var percentage = (72 / enemies[i].maxHealth) * enemies[i].health
                    ctx.beginPath()
                    ctx.rect(73*enemies[i].X, 73*enemies[i].Y+65, percentage, 7)
                    ctx.closePath()
                    ctx.stroke()
                    ctx.fill()
                }
            }
        } catch (e) {
            console.error(e)
        }
        try {
            var arrows = [
                await canvas.loadImage(this.getTwemojiLink("➡")),
                await canvas.loadImage(this.getTwemojiLink("⬅")),
                await canvas.loadImage(this.getTwemojiLink("⬆")),
                await canvas.loadImage(this.getTwemojiLink("⬇"))
            ]
            for (let i = 0; i < players.length; i++) {
                var playerColorSets = [
                    {
                        emoji:await canvas.loadImage(this.getTwemojiLink("❤")),
                        color:"#de2e43",
                        emptyColor:"#cd1d32",
                        rgbArray:[222, 46, 67]
                    },
                    {
                        emoji:await canvas.loadImage(this.getTwemojiLink("💙")),
                        color:"#5dadec",
                        emptyColor:"#4c9cdb",
                        rgbArray:[93, 173, 236]
                    },
                    {
                        emoji:await canvas.loadImage(this.getTwemojiLink("💚")),
                        color:"#78b159",
                        emptyColor:"#67a048",
                        rgbArray:[120, 177, 89]
                    },
                    {
                        emoji:await canvas.loadImage(this.getTwemojiLink("💛")),
                        color:"#fdcb58",
                        emptyColor:"#ecba47",
                        rgbArray:[253, 203, 88]
                    }
                ]
                var player = players[i]
                var character = await canvas.loadImage(db.get(player.user + ".characters[0].image"))
        
                var OffsetX,OffsetY,OtherX,OtherY;
                if(character.height > character.width){
                    OtherY = 72
                    OtherX = character.width * 72 / character.height
                    OffsetX = (72 - OtherX) / 2
                    OffsetY = 0
                }else{
                    OtherX = 72
                    OtherY = character.height * 72 / character.width
                    OffsetY = (72 - OtherY) / 2
                    OffsetX = 0
                }
                ctx.drawImage(character, 73*player.X + OffsetX, 73*(player.Y - 1) + OffsetY, OtherX, OtherY);
                
                offsetArrows = [
                    [73, 19],
                    [-37, 19],
                    [19, -37],
                    [19, 73]
                ]
    
                //draw direction arrows
                var coloredArrows = []
    
                for (let i2 = 0; i2 < arrows.length; i2++) {
                    var arrow = arrows[i2];
                    var rgbk = this.generateRGBKs(arrow)
                    var generatedArrow = await this.generateTintImage(arrow, rgbk, playerColorSets[i].rgbArray[0], playerColorSets[i].rgbArray[1], playerColorSets[i].rgbArray[2])
                    coloredArrows.push({
                        image: generatedArrow,
                        position: offsetArrows[i2]
                    })
                }
    
                coloredArrows.forEach(arrow => {
                    ctx.drawImage(arrow.image, 73*player.X + arrow.position[0], 73*(player.Y -1) + arrow.position[1], 36, 36)
                })
    
    
                ctx.beginPath()
                ctx.rect(73*player.X + OffsetX, 73*(player.Y - 1) + OffsetY, OtherX, OtherY)
                ctx.closePath()
                ctx.strokeStyle = playerColorSets[i].color
                ctx.stroke()
                console.log(character.height, character.width, OtherX, OtherY)
                ctx.fillStyle = "#ffffff"
                ctx.textAlign = "end";
                var healthBarWidth = (73*size.x)/4-77
                var healthBarPosition = 75 + ((healthBarWidth + 77) * i)
                ctx.beginPath();
                ctx.rect(healthBarPosition, 73*size.y+61, healthBarWidth, 30)
                ctx.closePath();
                ctx.fillStyle = playerColorSets[i].emptyColor
                ctx.fill();
        
                console.log(parseInt((healthBarWidth / player.maxHealth) * player.health))
                ctx.fillStyle = playerColorSets[i].color
                ctx.beginPath();
                ctx.rect(healthBarPosition, 73*size.y+61, parseInt((healthBarWidth / player.maxHealth) * player.health), 30)
                ctx.closePath();
                ctx.drawImage(playerColorSets[i].emoji, healthBarPosition-53, 73*size.y+50, 52, 52)
                ctx.drawImage(playerColorSets[i].emoji, 73*player.X+57, 73*(player.Y - 1)+57, 16, 16)
                ctx.fill();
                ctx.fillStyle = "#ffffff"
                ctx.textAlign = "left"
                ctx.fillText(`${player.health}/${player.maxHealth}hp`, healthBarPosition, 73*size.y+80)
            }
            
        } catch (e) {
            console.error(e)
        }
        var mapName = theActualData.title
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "start";
        ctx.fillText(mapName, 1, 73*size.y+40)
        var attachment = new Discord.MessageAttachment(theCanvas.toBuffer(), 'map.png');
        return attachment;
    },
    newEnemiesPosition: function(enemies, players, fakeMap){
            var newPosition = []
            enemies.filter(x => x.health > 0)
            enemies.forEach(enemy => {
                var nearbyPlayers = players.filter(x => enemy.X-2 < x.X && x.X < enemy.X+2 && enemy.Y-2 < x.Y+1 && x.Y+1 < enemy.Y + 2 && enemy.health > 0)
                if (nearbyPlayers.length){
                    nearbyPlayers.forEach(player => {
                        var distance = {
                            X: Math.abs(enemy.X - player.X),
                            Y: Math.abs(enemy.Y - player.Y),
                            realX: enemy.X - player.X,
                            realY: enemy.Y - player.Y
                        }
                        if(distance.X > distance.Y){
                            if(distance.realX < 0){
                                if(this.ScanCollisionsVersion2(enemy.X+1, enemy.Y, fakeMap)){
                                    enemy.X += 1
                                }
                            }else{
                                if(this.ScanCollisionsVersion2(enemy.X-1, enemy.Y, fakeMap)){
                                    enemy.X -= 1
                                }
                            }
                        }else{
                            if(distance.realY > 0){
                                if(this.ScanCollisionsVersion2(enemy.X, enemy.Y+1, fakeMap)){
                                    enemy.Y += 1
                                }
                            }else{
                                if(this.ScanCollisionsVersion2(enemy.X, enemy.Y-1, fakeMap)){
                                    enemy.Y -= 1
                                }
                                
                            }
                        }
                    })
                    newPosition.push(enemy)
                }else{
                    if(enemy.health > 0){
                        var the_move = Math.round(Math.random() * 3)
                        var moved_enemy = {...enemy}
                        switch (the_move) {
                            case 0: /* droite */ moved_enemy.X += 1; break;
                            case 1: /* gauche */ moved_enemy.X -= 1; break;
                            case 2: /*  bas   */ moved_enemy.Y += 1; break;
                            case 3: /*  haut  */ moved_enemy.Y -= 1; break;
                        
                            default:
                                console.log("M3RD3!")
                                break;
                        }
                        if(this.ScanCollisionsVersion2(moved_enemy.X, moved_enemy.Y, fakeMap)){
                            newPosition.push(moved_enemy)
                        }else{ newPosition.push(enemy) }
                    }else if (enemy.health > 0){ newPosition.push(enemy)} 
                }
            })
            return newPosition;
    },
    damagePlayers: function(enemies, players){
            players.forEach(player => {
                var nearbyEnemies = enemies.filter(x => player.X-2 < x.X && x.X < player.X+2 && player.Y-2 < x.Y+1 && x.Y+1 < player.Y + 2)
                console.log("NearbyEnemies for "+player.user+":", nearbyEnemies)
                if(nearbyEnemies.length > 0){
                    var randomThing = Math.floor(Math.random() * 5)
                    if(randomThing < 3){
                        player.health -= 1
                    }
                }
            })
            console.log(players)
            return players;
    },
    ScanCollisionsVersion2: function(X, Y, area) {
            try {
                var areaArray = area.data
                var collisions = area.collisions
                if (areaArray[Y]){
                    var actualLine = areaArray[Y].split('')
                    if (collisions.indexOf(actualLine[X * 2]) != -1) {
                        if(0<X<17)return false; 
                    }else return true;
                }else return true;
            } catch (e) {
                console.error(e)
            }
            
    },
    generateRGBKs: function( img ) {
            var w = img.width;
            var h = img.height;
            var rgbks = [];
        
            var canvas1 = canvas.createCanvas(w, h)
            
            var ctx = canvas1.getContext("2d");
            ctx.drawImage( img, 0, 0 );
            
            var pixels = ctx.getImageData( 0, 0, w, h ).data;
        
            // 4 is used to ask for 3 images: red, green, blue and
            // black in that order.
            for ( var rgbI = 0; rgbI < 4; rgbI++ ) {
                var canvas2 = canvas.createCanvas(w, h)
                var ctx = canvas2.getContext('2d');
                ctx.drawImage( img, 0, 0 );
                var to = ctx.getImageData( 0, 0, w, h );
                var toData = to.data;
                
                for (
                        var i = 0, len = pixels.length;
                        i < len;
                        i += 4
                ) {
                    toData[i  ] = (rgbI === 0) ? pixels[i  ] : 0;
                    toData[i+1] = (rgbI === 1) ? pixels[i+1] : 0;
                    toData[i+2] = (rgbI === 2) ? pixels[i+2] : 0;
                    toData[i+3] =                pixels[i+3]    ;
                }
                
                ctx.putImageData( to, 0, 0 );
                
                // image is _slightly_ faster then canvas for this, so convert
                var imgComp = new canvas.Image();
                imgComp.src = canvas2.toDataURL();
                
                rgbks.push( imgComp );
            }
        
            return rgbks;
    },
    generateTintImage: async function( img, rgbks, red, green, blue ) {
            var buff = canvas.createCanvas(img.width, img.height)
            
            var ctx  = buff.getContext("2d");
        
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'copy';
            ctx.drawImage( rgbks[3], 0, 0 );
        
            ctx.globalCompositeOperation = 'lighter';
            if ( red > 0 ) {
                ctx.globalAlpha = red   / 255.0;
                ctx.drawImage( rgbks[0], 0, 0 );
            }
            if ( green > 0 ) {
                ctx.globalAlpha = green / 255.0;
                ctx.drawImage( rgbks[1], 0, 0 );
            }
            if ( blue > 0 ) {
                ctx.globalAlpha = blue  / 255.0;
                ctx.drawImage( rgbks[2], 0, 0 );
            }
        
            return buff;
    }
}


exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    message.channel.send("Hmm... I see... You aren't supposed to see that.")
}