const {
    join
} = require('../utils/join');
const URL = require('url');
const music_main = require("../music/main.js");
const ytpl = require('ytpl');
exports.run = async (client, message, args) => {
    const PLAYLIST_REGEX = /^(PL|UU|LL|RD)[a-zA-Z0-9-_]{16,43}$/;
    const ALBUM_REGEX = /^OLAK5uy_[a-zA-Z0-9-_]{33}$/;
    let url = args[0];
    const parsed = URL.parse(url, true);
    console.log(parsed);
    console.log([PLAYLIST_REGEX.test(parsed.query.list), ALBUM_REGEX.test(parsed.query.list)]);
    message.delete();

    let server;
    if (servers[message.guild.id]) {
        if (servers[message.guild.id].connection.leave) await join(message);
        if (!servers[message.guild.id].connection) return;
        console.log(servers[message.guild.id].connection.channel)
        if (+servers[message.guild.id].connection.channel.id === +message.member.voice.channel) {
            server = servers[message.guild.id];
        }
    } else {
        await join(message);
    }
    let playlistG;
    server = servers[message.guild.id];
    if (/music./i.test(url)) url = url.replace(/music./i, '');
    await ytpl(url, (err, playlist) => {
        if (err) throw err;
        //console.log(playlist);
        playlistG = playlist;
        playlist.items.map((el => {
            server.queue.push({
                url: el.url_simple,
                title: el.title,
                length: el.duration,
                thumbnail: el.thumbnail
            })
        }))
        //console.log(server.queue);
        if (server.queue.length === playlistG.items.length) {
            console.log([server.queue.length, playlistG.items.length])
            music_main(message, client, "PLAYLIST_PLAY");
            //disp_control(server, message);
        }
    })

}