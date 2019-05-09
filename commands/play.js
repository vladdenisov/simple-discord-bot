const ytdl = require('ytdl-core');
const {
    prefix
} = require('../json/config.json');

async function playSong(server, message) {
    const link = String(server.queue[0]);
    const song_name_next = await ytdl.getInfo(link);
    message.channel.send(`Now playing ${song_name_next.title}`);
    server.dispatcher = server.connection.play(ytdl(link, {
        filter: "audioonly"
    }));
    server.dispatcher.on('end', async () => {
        if (server.queue[1]) {
            server.queue.shift();
            await playSong(server, message);
            return;
        }
        if (server.queue[0] && !server.queue[1]) {
            message.member.voiceChannel.leave();
            message.channel.send("Queue is clear. Leaving channel")
        }
    })
    server.dispatcher.on('error', (error) => {
        console.log(error);
        server.queue.shift();
        playSong(server, message);
    })
}

exports.run = async (client, message, args) => {
    let server = servers[message.guild.id];
    if (server === undefined) {
        message.reply(`You need to run ${prefix}join command first, even if i'm in channel`);
        return;
    }
    let urlI = String(args[0]);
    let song_name;
    //console.log(server.queue + "lol");
    let name;
    try {
        song_name = await ytdl.getInfo(urlI);
    } catch (error) {
        message.reply("Provide valid link to YouTube video");
    } finally {
        if (song_name.title) {
            server.queue.push(urlI);
            if (server.queue.length > 1) {
                async function a() {
                    message.reply(`Added ${song_name.title} to queue on ${server.queue.length - 1} position`);
                    return;
                }
                a();
            } else {
                await playSong(server, message);
            }
        } else {

        }
        console.log("----- " + server.queue)
    }
}
module.exports.playSong = playSong;