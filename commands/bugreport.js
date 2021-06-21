const Discord = require('discord.js')
const functions = require('./functions/Tools')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var Report = args.join(' ')
    if (!Report) return message.channel.send("Error: Report cannot be null or undefined.")
    function checkID(int){
        var ID = functions.makeid(int)
        if (bug.get('bugReports').find((x) => x.ReportId == ID)){
            checkID(int)
        }else{
            return ID;
        }
    }
    var REPORT_ID = checkID(7)
    var FullReportData = {
        user: message.author.id,
        username: message.author.tag,
        server: message.guild.id,
        serverName: message.guild.name,
        ReportId: REPORT_ID,
        ReportMessage: Report
    }
    bug.push('bugReports', FullReportData)
    console.log("Nouveau rapport de bug! \n------------------\n", FullReportData)
    var BugEmbed = new Discord.MessageEmbed()
        .setTitle(cLangJSON.bugreport.thanks + message.author.username)
        .setDescription(cLangJSON.bugreport.report + "\n" + Report)
        .setFooter(cLangJSON.bugreport.ID + FullReportData.ReportId)
    message.channel.send(BugEmbed)

    var ReportChannel = bot.guilds.cache.get('744310454519726160').channels.cache.get('770953704915992587');
    var ReportEmbed = new Discord.MessageEmbed()
        .setTitle("Bug report coming from " + FullReportData.username)
        .setDescription("Report: \n \n" + FullReportData.ReportMessage)
        .addField("Server:", FullReportData.serverName)
        .addField("Report ID:", FullReportData.ReportId)
        .setFooter("User ID: "+ FullReportData.user + " | Server ID: " + FullReportData.server)
        .setColor("RANDOM")
    ReportChannel.send("Hey <@448560475987509268>! Y'a un problème...", ReportEmbed)
}