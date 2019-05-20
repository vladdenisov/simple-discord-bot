const {
    join
} = require('../utils/join');
const {
    playYT
} = require('../utils/playYT');
const ytdl = require('ytdl-core');

exports.run = async (client, message, args) => {
    let server;
    let info;
    let url = args[0];
    if (servers[message.guild.id]) {
        if (+servers[message.guild.id].connection.channel.id === +message.member.voice.channel) {
            server = servers[message.guild.id];
        }
    } else {
        server = await join(message);
    }
    if (url.indexOf('youtube') || url.indexOf('youtu.be')) {
        try {
            info = await ytdl.getBasicInfo(url);
            console.log(info);
        } catch (error) {
            message.reply("Provide valid link to YouTube video");
        } finally {
            if (info.title) {
                let obj = {
                    url: url,
                    title: info.title,
                    length: info.length_seconds
                }
                server.queue.push(obj);
                if (!server.queue[1]) {
                    playYT(message);
                } else {
                    message.reply(`Added ${info.title} to queue on ${server.queue.length - 1} position`);
                }
            }

        }
    }
}