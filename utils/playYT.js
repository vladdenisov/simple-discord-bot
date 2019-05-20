const ytdl = require('ytdl-core');
const playYT = async (message) => {
    let server = servers[message.guild.id];
    const link = String(server.queue[0].url);
    const song_name_next = await ytdl.getInfo(link);
    message.channel.send(`Now playing ${song_name_next.title}`);
    server.dispatcher = server.connection.play(ytdl(link, {
        filter: "audioonly"
    }));
    server.dispatcher.on('end', async () => {
        console.log(server.queue);
        // if (server.queue[0] && !server.queue[1]) {
        //     message.member.voice.channel.leave();
        //     message.channel.send("Queue is clear. Leaving channel")
        // }
        if (server.queue[1]) {
            server.queue.shift();
            playYT(message);
            return 0;
        }

    })
    server.dispatcher.on('error', (error) => {
        console.log(error);
        server.queue.shift();
        parseUrll(server.queue[0], message, 'play');
    })
}
module.exports.playYT = playYT;