const ytlist = require('youtube-playlist');
const {
    playSong
} = require('./play.js');
const {
    prefix
} = require('../json/config.json');

exports.run = (client, message, args) => {
    let server = servers[message.guild.id];
    if (server === undefined) {
        message.reply(`You need to run ${prefix}join command first, even if i'm in channel`);
        return;
    }
    let queue = Promise.resolve();
    let playlistI;
    let url = args[0];
    if (/music./i.test(url)) url = url.replace(/music./i, '');
    console.log(url);
    ytlist(url, 'url')
        .then(res => {
            playlistI = res.data.playlist;
            res.data.playlist.map(el => server.queue.push(el))
        })
        .then((res) => {
            message.reply(`Added ${playlistI.length} items from your playlist!`);
            console.log(server.queue.length + '+' + playlistI.length);
            if (server.queue.length === playlistI.length) {
                playSong(server, message);
            }
        });
}