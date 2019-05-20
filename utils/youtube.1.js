const ytdl = require('ytdl-core');
const {
    prefix
} = require('../json/config.json');
const {
    parseUrll
} = require('./parseUrl.js');
const {
    disp_control
} = require('./dispathcer');

async function playYoutube(message) {
    return new Promise(async (resolve, reject) => {
        let server = servers[message.guild.id];
        const link = String(server.queue[0].url);
        const song_name_next = await ytdl.getInfo(link);
        message.channel.send(`Now playing ${song_name_next.title}`);
        server.dispatcher = server.connection.play(ytdl(link, {
            filter: "audioonly"
        }));
        //disp_control(server, message);
        resolve(server.dispatcher);
    })

}

module.exports.playSong = playYoutube;