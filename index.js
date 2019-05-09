const discord = require('discord.js');
const {
    prefix,
    token,
    game_name
} = require('./json/config.json');
const Enmap = require("enmap");
const fs = require("fs");
const queue = require('./commands/play.js');

const client = new discord.Client();
client.commands = new Enmap();
global.servers = {};

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`Attempting to load command ${commandName}`);
        client.commands.set(commandName, props);
    });
});

client.on("ready", () => {
    console.log(`Connected as ${client.user.tag}`);
    client.user.setActivity(game_name);
});

client.on("message", (message) => {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    console.log(args);
    const cmd = client.commands.get(command);
    if (!cmd) return;
    cmd.run(client, message, args);
});

client.login(token);