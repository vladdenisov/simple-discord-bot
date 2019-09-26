const { Client, MessageEmbed } = require('discord.js');
function leave(message) {
    let server = servers[message.guild.id];
    server.connection = {};

    servers[message.guild.id] = {
        queue: [],
        "hooked": true,
        connection: { "leave": true },
        isPaused: false
    }
    server.dispatcher.pausedSince === null;
    message.channel.messages.fetch().then((messages) => {
        messages = Array.from(messages);
        let firstMsg = messages[messages.length - 1][1];
        let secMsg = messages[messages.length - 2][1];
        const eEmbed = new MessageEmbed()
            .setColor('#0652DD')
            .setTitle('Music Bot')
            .setAuthor('Music')
            .setDescription('Playing Music')
            .setThumbnail('https://cdn.discordapp.com/avatars/573460427753914368/5f6f60497f371261922916793ffbead0.png')
            .addField('Now Playing', 'Nothing')
            .addBlankField()
            .addField('Send link here to play something.', "Waiting...");
        firstMsg.edit(eEmbed);
        secMsg.edit(`***Queue List: \n***`);
    })
    message.member.voice.channel.leave();

}
module.exports.leave = leave;