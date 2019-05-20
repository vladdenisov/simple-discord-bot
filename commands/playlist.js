const ytlist = require('youtube-playlist');
const {
    playYT
} = require('../utils/playYT');
const {
    join
} = require('../utils/join');
exports.run = async (client, message, args) => {
    let server;
    if (servers[message.guild.id]) {
        if (+servers[message.guild.id].connection.channel.id === +message.member.voice.channel) {
            server = servers[message.guild.id];
        }
    } else {
        server = await join(message);
    }
    let playlistI;
    let url = args[0];
    if (/music./i.test(url)) url = url.replace(/music./i, '');
    console.log(url);
    await ytlist(url, ['url', 'name'])
        .then(res => {
            playlistI = res.data.playlist;
            res.data.playlist.map(el => {
                let obj = {
                    url: el.url,
                    title: el.name
                }
                server.queue.push(obj);
            })
        })
        .then(async (res) => {
            message.reply(`Added ${playlistI.length} items from your playlist!`);
            console.log(server.queue.length + '+' + playlistI.length);
            if (server.queue.length === playlistI.length) {
                playYT(message);
                //disp_control(server, message);
            }
        });
}