const Discord = require('discord.js')
const functions = require('../functions/Tools')

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var bugReports = bug.get("bugReports")
    var renderedBugReports = bugReports.reverse();

    if(args[0] == "list" || !args[0]){
        var messagesEmbed = new Discord.MessageEmbed()
            .setTitle("Gui, you got A LOT of stuff to fix!")
        if(renderedBugReports.length <= 10){
            renderedBugReports.forEach(element => {
                var user = element.username + " | (" + element.ReportId + ")"
                var ReportMessage = element.ReportMessage
                var rawData = element
                console.log(rawData)
                messagesEmbed.addField(user, ReportMessage)
            })
        }else{
            var availablePages = Math.ceil((renderedBugReports.length)/10)
            var pageNum = parseInt(args[1]) || 0
            messagesEmbed.setFooter("Page " + (pageNum + 1) + "/" + availablePages)
            for (let i = 10*pageNum; i < 10*(pageNum + 1); i++) {
                if (!renderedBugReports[i]) continue;
                var element = renderedBugReports[i]
                var user = element.username + " | (" + element.ReportId + ")"
                var ReportMessage = element.ReportMessage
                var rawData = element
                console.log(rawData)
                messagesEmbed.addField(user, ReportMessage)
            }
        }
        message.channel.send(messagesEmbed)
    }else switch (args[0]) {
        case "remove":
            function isNumeric(value) {
                return /^\d+$/.test(value);
            }
            if (isNumeric(args[1])){
                renderedBugReports.splice(parseInt(args[1]), 1)
                bug.set('bugReports', renderedBugReports.reverse())
                message.channel.send("Deleted.")
            }else{
                var data = bugReports.filter(x => x.ReportId != args[1])
                bug.set('bugReports', data)
                message.channel.send("deleted!")
            }
            break;

        case "bulkDelete":
            function isNumeric(value) {
                return /^\d+$/.test(value);
            }
            if (isNumeric(args[1]) && isNumeric(args[2])){
                renderedBugReports.splice(parseInt(args[1]), parseInt(args[2]))
                bug.set('bugReports', renderedBugReports.reverse())
                message.channel.send("Deleted "+args[2]+" elements.")
            }
            break;

        case "backup":
            var name = args[1] || functions.makeid(10)
            if(bug.get("backups."+name)) return message.channel.send("backups."+name + " already exists.")
            bug.set("backups."+name, {
                time: new Date(),
                data: bugReports})
            message.channel.send("Backed up "+ bugReports.length + "reports in backups."+ name)
            break;

        case "restoreBackup":
            var name = args[1]
            bug.set("bugReports", bug.get("backups."+name+".data"))
            console.log("Backed up data")
            message.channel.send("Restored data from backups."+name)
        break;

        case "reply":
            var replyingToMessage = bugReports.find(x => x.ReportId == args[1])
            if (!replyingToMessage) message.channel.send("This message doesn't exist.")
            var user = bot.users.cache.get(replyingToMessage.user);
            console.log(JSON.stringify(user, null, 4))
            args.splice(0, 2)
            messageEmbedMoment = new Discord.MessageEmbed()
                .setTitle("#Guigui's bug report system")
                .setDescription("In reference to your post: \""+replyingToMessage.ReportMessage+"\"")
                .addField("Gui's commentary:", args.join(' '))
                .setFooter("Btw, my username is "+ message.author.tag+", if you need help.")

            user.send("The developer has come to tell you something about your bug report!", messageEmbedMoment)
        break;

        case "reverse":
            db.set("bugReports", renderedBugReports)
            message.channel.send("Order reversed!")
        break;

        default:
            break;
    }
}

/* donc en gros, qu'est-ce qu'un bugReport?
Cela se présente comme ceci: 
{
    user: "The id of the user."
    username: "The username of the user when he sent the report followed by its #XXXX"
    server: "The id of the server where it got sent."
    servername: "The name of the server the report is from."
    ReportId: "The report's ID."
    ReportMessage: "The meat of the object"
}

*/