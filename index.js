/*/////////////////
/     DO NOT      /
/     DISTURB     /
/////////////////*/

const slash = require('slash-create');
const Discord = require('discord.js');
const db = require('quick.db');
const fs = require('fs');
const bot = new Discord.Client();
const path = require('path');
const canvas = require('canvas');
const lang = require('./languageShiet.json');
const achievements = require('./achievements.json');
const important = require('./important.json')
const functions = require('./commands/functions/Tools')

var serverMaps = new db.table('serverMaps')
var dungeons = new db.table('dungeons')
var bug = new db.table('bugReports')

var prefix = important.prefix


/*const creator = new slash.SlashCreator({
    applicationID:"no",
    publicKey:"fuck you",
    token:important.token,
})*/
bot.login(important.token)
/*module.exports.cLangJSON = lang[0];
module.exports.databases = {
    db: db,
    serverMaps: serverMaps,
    dungeons: dungeons,
    bug: bug
}
creator.withServer(new slash.GatewayServer((handler) => bot.ws.on('INTERACTION_CREATE', handler)))
creator.registerCommand(path.join(__dirname, "slash-commands-shite.js")).syncCommandsIn('744310454519726160')

module.exports.creator = creator;*/
module.exports.prefix = prefix;
module.exports.bot = bot;

bot.on('ready', () => {
    var MOTD = important.motd[Math.floor(Math.random() * (important.motd.length - 1))]
    bot.user.setActivity(`${prefix}help / Version 2.1.0 / Connected to ${bot.guilds.cache.size} servers / ${MOTD}`)
    console.log("G-UI deployed.")
})

//fonts area
canvas.registerFont(__dirname + '/assets/fonts/Whitney-Medium.ttf', { family: 'Whitney' })

bot.on('message', message => {
    if (message.content.startsWith(prefix)) {
        if (!message.guild) return;
        let args = message.content.slice(prefix.length).trim().split(' ');
        let cmd = args.shift().toLowerCase();
        var currentLang = db.get(message.author.id + ".language")
        let cLangJSON = lang[0]
        if(currentLang == "french"){
            cLangJSON = lang[1]
        }
        functions.problemCheck(message, db, serverMaps);
        try {
            if (cmd.startsWith("d.") && message.author.id == '448560475987509268'){
                var newCMD = cmd.substr(2)
                console.log("Accesing debug mode as #Guigui, using debug command " + `./commands/debug/${newCMD}.js`)
                delete require.cache[require.resolve(`./commands/debug/${newCMD}.js`)];
                let commandFile = require(`./commands/debug/${newCMD}.js`)
                commandFile.run(bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix)
            }else{
                if (important.betaTesters.includes(message.author.id) && fs.existsSync(`./commands/beta/${cmd}.js`)){
                    console.log("Accesing beta-testing as " + message.author.tag + ", using command " + cmd)
                    delete require.cache[require.resolve(`./commands/beta/${cmd}.js`)];
                    let commandFile = require(`./commands/beta/${cmd}.js`)
                    commandFile.run(bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix)
                }else{
                    delete require.cache[require.resolve(`./commands/${cmd}.js`)];
                    let commandFile = require(`./commands/${cmd}.js`)
                    commandFile.run(bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix)
                }
            }
            delete require.cache[require.resolve(`./commands/functions/Tools.js`)];
            delete require.cache[require.resolve("./languageShiet.json")];
        }catch(e){
            try {
                if (fs.existsSync(`./commands/${cmd}.js`)) {
                    if (message.author.id == '448560475987509268') {
                        var ErrorEmbed = new Discord.MessageEmbed()
                            .setTitle(">_ g_ui.error.console")
                            .setDescription("Hey, I just got a bluescreen :(")
                            .addField("Error field:", "```\n" + e + "\n```")
                            .setColor("0x0000FF")
                        message.channel.send(ErrorEmbed)
                    }else{
                        message.channel.send("G-UI.exe stopped working.")
                    }
                    console.error(e)
                }else{
                    if (important.betaTesters.includes(message.author.id) && fs.existsSync(`./commands/beta/${cmd}.js`)){
                        var ErrorEmbed = new Discord.MessageEmbed()
                            .setTitle(">_ g_ui.error.console")
                            .setDescription("Whoops. The beta command crashed. :(")
                            .addField("Short error:", "```\n" + e + "\n```")
                            .setColor("0x00dd00")
                        message.channel.send(ErrorEmbed)
                        console.error(e)
                    }else{
                        var SyntaxErrorEmbed = new Discord.MessageEmbed()
                            .setTitle("Syntax Error:")
                            .setDescription("Invalid command: g/" + cmd)
                            .addField("Things you can check:", "-Is the command written correctly? \n-Are you sure this command exists? Try searching in g/help.")
                            .setColor("RED")
                            .setFooter("uwu owo")
                        message.channel.send(SyntaxErrorEmbed)
                    }
                }
                console.log(e)
            } catch (e) {
                var SyntaxErrorEmbed = new Discord.MessageEmbed()
                    .setTitle("Syntax Error:")
                    .setDescription("Invalid command: g/" + cmd)
                    .addField("Things you can check:", "-Is the command written correctly? \n-Are you sure this command exists? Try searching in g/help.")
                    .setColor("RED")
                    .setFooter("uwu owo")
                message.channel.send(SyntaxErrorEmbed)
            }
        }
    }
})

bot.on("disconnect", () => {
    console.error("G-UI disconnected for some reason...")
})