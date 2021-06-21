const Discord = require('discord.js');

exports.run = async (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    var linksEmbed = new Discord.MessageEmbed()
        .setTitle("Important links")
        .addField("Support discord", "[Get all informations about the newest updates, and discuss with the developer! (also his youtube channel's server but h)](https://discord.gg/AWw4kxc)")
        .addField("G-UI's twitter", "[@G_UI_TWEET](https://twitter.com/G_UI_TWEET)")
        .addField("The developer's links (#Guigui):", "[Twitch](https://twitch.tv/hastag_guigui) \n[Youtube](https://www.youtube.com/channel/UCLgu-4-oMqRZVbgwbgzIo7A) \n[Twitter](https://twitter.com/_GuiguiYT)")
    message.channel.send(linksEmbed)
}