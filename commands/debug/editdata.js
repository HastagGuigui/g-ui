exports.run = (bot, message, args, cLangJSON, db, serverMaps, dungeons, bug, prefix) => {
    console.log("h")
    switch (args[0]) {
        default:
        case "db":
        switch (args[2]) {
            case "string":db.set(args[1], args[3]);break;
            case "int":var integrer = parseInt(args[3]);db.set(args[1], integrer);break;
            case "bool":var boolean;if (args[3] == "true"){boolean = true}else if (args[3] == "false"){boolean = false};db.set(args[1], boolean);break;
            case "json":var json = JSON.parse(args[3]);db.set(args[1], json);break;
            case "pushToArray":db.push(args[1], args[3]);break;
            default:return;
        }
        break;
        case "serverMaps":
        switch (args[2]) {
            case "string":serverMaps.set(args[1], args[3]);break;
            case "int":var integrer = parseInt(args[3]);serverMaps.set(args[1], integrer);break;
            case "bool":var boolean;if (args[3] == "true"){boolean = true}else if (args[3] == "false"){boolean = false};serverMaps.set(args[1], boolean);break;
            case "json":var json = JSON.parse(args[3]);serverMaps.set(args[1], json);break;
            case "pushToArray":serverMaps.push(args[1], args[3]);break;
            default:return;
        }
        break;
        case "bug":
        switch (args[2]) {
            case "string":bug.set(args[1], args[3]);break;
            case "int":var integrer = parseInt(args[3]);bug.set(args[1], integrer);break;
            case "bool":var boolean;if (args[3] == "true"){boolean = true}else if (args[3] == "false"){boolean = false};bug.set(args[1], boolean);break;
            case "json":var json = JSON.parse(args[3]);bug.set(args[1], json);break;
            case "pushToArray":bug.push(args[1], args[3]);break;
            default:return;
        }
    }
    message.channel.send("La valeur **" + args[1] + "** a été mise sur **" + args[3] + "**!")
}