const ytdl = require('ytdl-core');
const {
    prefix
} = require('../json/config.json');

async function playSong(server, urlI, message) {
    if (!urlI) {
        serverQueue.voiceChannel.leave();
        server.queue = [];
        return;
    }
    server.dispatcher = server.connection.playStream(ytdl(urlI, {
        filter: "audioonly"
    }));
    server.dispatcher.on('end', async () => {
        if (server.queue[1]) {
            server.queue.shift();
            const song = String(server.queue[0]);
            console.log("------SONG " + song);
            const song_name_next = await ytdl.getInfo(song);
            message.channel.send(`Now playing ${song_name_next.title}`);
            await playSong(server, song, message);
            return;
        }
        if (server.queue[0] && !server.queue[1]) {
            message.member.voiceChannel.leave();
            message.channel.send("Queue is clear. Leaving channel")
        }
    })
    server.dispatcher.on('error', (error) => {
        console.log(error);
    })
}

exports.run = async (client, message, args) => {
    let server = servers[message.guild.id];
    if (server === undefined) {
        message.reply(`You need to run ${prefix}join command first, even if i'm in channel`);
        return;
    }
    let urlI = String(args[0]);
    server.queue.push(urlI);
    //console.log(server.queue + "lol");
    let name;
    const song_name = await ytdl.getInfo(urlI);
    if (server.queue.length > 1) {
        async function a() {
            message.reply(`Added ${song_name.title} to queue on ${server.queue.length - 1} position`);
            return;
        }
        a();
    } else {
        message.channel.send(`Now playing ${song_name.title}`);
        await playSong(server, urlI, message);
    }

    console.log("----- " + server.queue)
}
module.exports.playSong = playSong;