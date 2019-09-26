const ytdl = require('ytdl-core');
const { leave } = require('./leave.js');
const { join } = require('../utils/join.js');
const { Client, MessageEmbed } = require('discord.js');
const playYT = async (message) => {
    let server = servers[message.guild.id];
    if (server.connection.leave === true) {
        console.log("new connect");
        await join(message);
    }

    //console.log(server.queue);
    const link = String(server.queue[0].url);
    message.channel.messages.fetch().then((messages) => {
        messages = Array.from(messages);
        let firstMsg = messages[messages.length - 1][1];
        let secMsg = messages[messages.length - 2][1];
        let t = 0, l = 0;
        const eEmbed = new MessageEmbed()
            .setColor('#0652DD')
            .setTitle('Music Bot')
            .setAuthor('Music')
            .setDescription('Playing Music')
            .setImage(server.queue[0].thumbnail)
            .addField('Now Playing', server.queue[0].title)
            .addField('Length: ', server.queue[0].length)
        firstMsg.edit(eEmbed);
        firstMsg.react("⏭").then(() => firstMsg.react('⏯')).then(() => firstMsg.react('⏹'))
        const filter = (reaction, user) => {
            return ['⏹', '⏯', '⏭'].includes(reaction.emoji.name) && user.id !== firstMsg.author.id;
        };
        let m = [];
        server.queue.map((el) => { if (t === 0) { t++; return; } else if (t > 20) { return; } else { t++; m.push(`${t - 1}. **${el.title}** __Length: ${el.length}__\n`); } })
        secMsg.edit(`***Queue List: \n*** ${m.join("")}`);
    })
    try {
        server.dispatcher = server.connection.play(ytdl(link, {
            filter: "audioonly"
        }))
    } catch (error) {
        console.error([error.message, error.name]);
        message.channel.send(error.message).then((e) => setTimeout(() => e.delete(), 2000))
        server.queue.shift();
        playYT(message);
    }

    server.dispatcher.on('end', async () => {
        //console.log(server.queue);
        // if (server.queue[0] && !server.queue[1]) {
        //     message.member.voice.channel.leave();
        //     message.channel.send("Queue is clear. Leaving channel")
        // }
        if (server.queue[1]) {
            server.queue.shift();
            playYT(message, server);
            return 0;
        }
        else { leave(message) }

    })
    server.dispatcher.on('error', (error) => {
        console.log(error);
        server.queue.shift();
        playYT(message);
    })
}
module.exports.playYT = playYT;