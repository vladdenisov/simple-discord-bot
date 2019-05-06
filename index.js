const Commando = require('discord.js-commando');
const config = require('./config.json');
const path = require('path');
const client = new Commando.Client({
    owner: '269691950787985408',
    commandPrefix: config.prefix,
    disableEveryone: true
});
client.once("ready", () => {
    console.log(`Connected as ${client.user.tag}`);
    client.user.setActivity(config.game_name);
});
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['group1', 'Our First Command Group']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));
client.login(config.token);