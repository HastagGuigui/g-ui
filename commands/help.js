const slash = require('slash-create');
const Discord = require('discord.js')
const creator = require("../index.js").creator;

exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    //define current permission level
    var permLevel = ["@"]
    if(db.get(message.author.id + ".characters[0]") != undefined) permLevel.push("C");
    if(message.author.id == '448560475987509268') permLevel.push("#");
    if(message.member.hasPermission("MANAGE_GUILD")) permLevel.push("A")
    if(message.author.id == message.guild.ownerID) permLevel.push("O")
    var HelpJSON = require("../help.json")
    var categories = [
        "basic",
        "rpg",
        "misc",
        "map"
    ]
    var Filtered_Help = HelpJSON.filter((element) => permLevel.includes(element.perms))
    if(!args[0]){
        var names = [];
        for (let i = 0; i < categories.length; i++) {
            var category = categories[i];
            var categ_arr = Filtered_Help.filter(element => element.category == category)
            var categ_names = []
            categ_arr.forEach(element => {
                categ_names.push(element.cmd)
            });
            var categ_name = categ_names.join(' | ' + prefix)
            names.push(prefix + categ_name)
        }
        var helpEmbed = new Discord.MessageEmbed()
            .setTitle(cLangJSON.help.title)
        for (let i = 0; i < names.length; i++) {
            var name = names[i];
            var category = cLangJSON.help.categories[i]
            helpEmbed.addField(category, name)
        }
        message.channel.send(helpEmbed)
    }else{
        var keyword = args[0]
        if(Filtered_Help.find(element => element.cmd == keyword)){
            //advanced command
            var actualCommandThing = Filtered_Help.find(element => element.cmd == keyword)
            var desc, adv_desc;
            if (cLangJSON.id == "fr"){
                desc = actualCommandThing.FRdesc
                adv_desc = actualCommandThing.FRadvancedDesc
            }else{
                desc = actualCommandThing.ENdesc
                adv_desc = actualCommandThing.ENadvancedDesc
            }
            var adv_help_embed = new Discord.MessageEmbed()
                .setTitle(actualCommandThing.cmd + "'s help menu")
                .addField(desc, adv_desc)
            message.channel.send(adv_help_embed)
        }else if (categories.includes(keyword)){
            //category
            var categ_embed = new Discord.MessageEmbed()
                .setTitle(cLangJSON.help.categories[categories.indexOf(keyword)])
            var categ_filter_stuf = Filtered_Help.filter((element) => element.category == keyword)
            categ_filter_stuf.forEach((Command) => {
                var name = prefix + Command.cmd;
                var description;
                if (cLangJSON.id == "fr"){
                    description = Command.FRdesc
                }else{
                    description = Command.ENdesc
                }
                categ_embed.addField(name, description)
            })
            message.channel.send(categ_embed)
        }
    }
}
/*module.exports = class HelpCommand extends slash.SlashCommand {
    constructor(creator) {
        super(creator, {
            name: 'help',
            description: 'If you ever need help.'
        })
        this.filePath = __filename;
    }

    async run(ctx) {
        if(ctx.data.options){
            return "test";
        }
        exports.run(undefined, ctx, ctx.data.options, require("../index.js").cLangJSON, require("../index.js").databases.db, require("../index.js").databases.serverMaps, require("../index.js").databases.dungeons, require("../index.js").databases.bug, require("../index.js").prefix);
        return;
    }
}*/