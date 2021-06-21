const {SlashCommand} = require("slash-create");
const Discord = require("discord.js");
var creator = require("./index").creator;

module.exports = class help extends SlashCommand {
    constructor(creator){
        super(creator, {
            name: 'help',
            description: 'Placeholder message',
            options: [
                {
                    name: "command",
                    description: "select what command you need help about",
                    type: 3,
                    required: false,
                    choices: [
                        {
                            name: "help",
                            value: "help"
                        }
                    ]
                }
            ]
        });
        this.filePath = __filename;
    }

    async run(ctx){
        console.log(ctx);
        var message = new Discord.Message()
        message.author = ctx.member
        message.guild = require("./index").bot.guilds.cache.get(ctx.guildID)
        require("./commands/help.js").run(require("./index").bot, )
    }
}