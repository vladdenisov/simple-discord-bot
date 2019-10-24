const ytdl = require('ytdl-core');
const {
    playYT
} = require('../utils/playYT.js');
const {
    parseSpoti
} = require('../utils/parseSpoti.js');
const { leave } = require('../utils/leave.js');
const { join } = require('../utils/join.js');
const { Client, MessageEmbed } = require('discord.js');

module.exports = async function music_main(message, client, args) {
    console.log([message.content]);
    message.delete();
    let l = 0;
    function fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s }
    if (!servers[message.guild.id]) { await join(message); l++ }
    let server = servers[message.guild.id]
    if (servers[message.guild.id]) {
        if (server.connection.leave === true) {
            console.log("new connect");
            l = await join(message);
        }
    }

    let info;
    //console.log("IS HOOKED: " + servers[message.guild.id].hooked);
    if (!servers[message.guild.id].hooked) {
        servers[message.guild.id] = {
            "hooked": true,
            connection: servers[message.guild.id].connection,
            queue: servers[message.guild.id].queue,
            dispatcher: servers[message.guild.id].dispatcher ? servers[message.guild.id].dispatcher : {}

        }
        if (server.dispatcher) server.dispatcher.pausedSince === null;
        //console.log("NEW ishooked" + servers[message.guild.id].hooked);
        //console.log("HOOKING");
        client.on('raw', event => {
            server = servers[message.guild.id];
            let mRCH = message.guild.channels.find(channel => channel.name === "music_req");
            if ((event.t === "MESSAGE_REACTION_ADD" || event.t === "MESSAGE_REACTION_REMOVE") && parseInt(mRCH.id) === parseInt(event.d.channel_id)) {
                if (message.guild.members.get(event.d.user_id).user.bot) return;
                if (event.d.emoji.name === "⏭") {
                    servers[message.guild.id].dispatcher.end();
                    server.dispatcher.pausedSince === null;
                }
                if (event.d.emoji.name === "⏹") {
                    //console.log('leavee');
                    leave(message);
                }
                if (event.d.emoji.name === "⏯") {
                    //console.log(["PAUSE", server.isPaused])
                    if (servers[message.guild.id].isPaused === true) {
                        servers[message.guild.id].dispatcher.resume();
                        servers[message.guild.id] = {
                            "hooked": servers[message.guild.id].hooked,
                            connection: servers[message.guild.id].connection,
                            queue: servers[message.guild.id].queue,
                            dispatcher: servers[message.guild.id].dispatcher ? servers[message.guild.id].dispatcher : {},
                            "isPaused": false
                        }
                    }
                    else {
                        servers[message.guild.id].dispatcher.pause();
                        servers[message.guild.id] = {
                            "hooked": servers[message.guild.id].hooked,
                            connection: servers[message.guild.id].connection,
                            queue: servers[message.guild.id].queue,
                            dispatcher: servers[message.guild.id].dispatcher ? servers[message.guild.id].dispatcher : {},
                            "isPaused": true
                        }
                    }
                }
            }
        });
    }
    // console.log([message.content.indexOf("youtube"), message.content.indexOf("spotify")])
    if (args === "PLAY_MUSIC") {
        if (message.content.indexOf('youtube') > 1 || message.content.indexOf('youtu.be') > 1) {
            console.log("YOUTUBE");
            let url = message.content;
            try {
                info = await ytdl.getBasicInfo(url);
            } catch (error) {
                message.reply("Provide valid link to YouTube video").then(el => setTimeout(() => el.delete(), 2000));
                console.log(error);
            } finally {
                if (info.title) {
                    let len = fmtMSS(info.length_seconds);
                    let obj = {
                        url: url,
                        title: info.title,
                        length: len,
                        thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[info.player_response.videoDetails.thumbnail.thumbnails.length - 1].url
                    }
                    server.queue.push(obj);
                    if (server.queue[0]) {
                        if (!server.queue[1]) {
                            playYT(message);
                        } else {
                            message.channel.messages.fetch().then(async (messages) => {
                                messages = Array.from(messages);
                                let secMsg = messages[messages.length - 2][1];
                                let t = 0;
                                let m = [];
                                server.queue.map((el) => { if (t === 0) { t++; return; } else if (t > 20) { return; } else { t++; m.push(`${t - 1}. **${el.title}** __Length: ${el.length}__\n`); } })
                                secMsg.edit(`***Queue List: \n*** ${m.join("")}`);
                            })
                        }
                    }
                }

            }
        }
        if (message.content.indexOf('spotify') > 1) {
            const parser = async (inputUrl) => {
                if (inputUrl.includes('/track/')) {
                    return 'song';
                }
                else if (inputUrl.includes('/playlist/')) {
                    return 'playlist';
                }
                else if (inputUrl.includes('/album/')) {
                    return 'album';
                }
                else if (inputUrl.includes('/artist/')) {
                    return 'artist';
                }
                else {
                    return new Error(`Invalid spotify URL`);
                }
            }
            console.log("SPOTIFY");
            let url = message.content;
            switch (await parser(url)) {
                case 'song': {
                    const data = await parseSpoti(url, "song");
                    server.queue.push({
                        url: data[0].link,
                        title: `${data[1].name} by ${data[1].artists[0]}`,
                        length: data[0].duration,
                        thumbnail: data[1].cover_url,
                        spotifyURL: data[1].url
                    })
                    //console.log(server.queue);
                    if (server.queue[0]) {
                        if (!server.queue[1]) {
                            playYT(message);
                        } else {
                            message.channel.messages.fetch().then(async (messages) => {
                                messages = Array.from(messages);
                                let secMsg = messages[messages.length - 2][1];
                                let t = 0;
                                let m = [];
                                server.queue.map((el) => { if (t === 0) { t++; return; } else if (t > 20) { return; } else { t++; m.push(`${t - 1}. **${el.title}** __Length: ${el.length}__\n`); } })
                                secMsg.edit(`***Queue List: \n*** ${m.join("")}`);
                            })
                        }
                    }
                    return;
                }
                case "album": {
                    const data = await parseSpoti(url, "album");
                    // console.log(data[0]);
                    data.map((data) => {
                        server.queue.push({
                            url: data[0].link,
                            title: `${data[1].name} by ${data[1].artists[0]}`,
                            length: data[0].duration,
                            thumbnail: data[1].cover_url,
                            spotifyURL: data[1].url
                        })
                    })
                    playYT(message);
                    return;
                }
                case "playlist": {
                    const data = await parseSpoti(url, "playlist");
                    // console.log(data[0]);
                    data.map((data) => {
                        server.queue.push({
                            url: data[0].link,
                            title: `${data[1].name} by ${data[1].artists[0]}`,
                            length: data[0].duration,
                            thumbnail: data[1].cover_url,
                            spotifyURL: data[1].url
                        })
                    })
                    playYT(message);
                    return;
                }
            }




        }
        if (parseInt(message.content.indexOf("youtube")) === -1 && message.content.indexOf("spotify") === -1) {
            if (message.content.indexOf("http") === -1 && message.content.indexOf("mp3") === -1) {
                message.channel.send(`Please send link to YouTube, Spotify or any music file`).then((m) => setTimeout(() => m.delete(), 2000));
                return;
            }
            //console.log(server.connection);
            server.dispatcher = server.connection.play(message.content);
            message.channel.messages.fetch().then((messages) => {
                messages = Array.from(messages);
                let firstMsg = messages[messages.length - 1][1];
                let secMsg = messages[messages.length - 2][1];
                let t = 0, l = 0;
                const eEmbed = new MessageEmbed()
                    .setColor("#FDA7DF")
                    .setTitle('Music Bot')
                    .setAuthor('Music')
                    .setDescription('Playing Music')
                    .setThumbnail('https://cdn.discordapp.com/avatars/573460427753914368/5f6f60497f371261922916793ffbead0.png');
                firstMsg.edit(eEmbed);
                firstMsg.react("⏭").then(() => firstMsg.react('⏯')).then(() => firstMsg.react('⏹'))
                let m = [];
                server.queue.map((el) => { if (t === 0) { t++; return; } else if (t > 20) { return; } else { t++; m.push(`${t - 1}. **${el.title}** __Length: ${el.length}__\n`); } })
                secMsg.edit(`***Queue List: \n*** ${m.join("")}`);
            })
        }
    }

    if (args === "PLAYLIST_PLAY") {
        playYT(message);
    }
}