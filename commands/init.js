const { Client, MessageEmbed } = require('discord.js');
exports.run = (client, message, args) => {
    let server = message.guild;
    console.log(server);
    message.guild.channels.create("music_req", "text").then((channel) => {
        const eEmbed = new MessageEmbed()
            .setColor('#0652DD')
            .setTitle('Music Bot')
            .setAuthor('Music')
            .setDescription('Playing Music')
            .setThumbnail('https://cdn.discordapp.com/avatars/573460427753914368/5f6f60497f371261922916793ffbead0.png')
            .addField('Now Playing', 'Nothing')
            .addBlankField()
            .addField('Send link here to play something.', "Waiting...");
        channel.send(eEmbed);
        channel.send("***Queue List:***");
    });
    message.channel.send("I've created a channel, called 'music_req', simply send url there to play");
} 