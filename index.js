const discord = require('discord.js');
const {
    prefix,
    token,
    game_name
} = require('./json/config.json');

const client = new discord.Client();

client.on("ready", () => {
    console.log(`Connected as ${client.user.tag}`);
    client.user.setActivity(game_name);
})

client.login(token);