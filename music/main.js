const ytdl = require('ytdl-core');
const {
    playYT
} = require('../utils/playYT.js');
const { leave } = require('../utils/leave.js');
const { join } = require('../utils/join.js');
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
    console.log("IS HOOKED: " + servers[message.guild.id].hooked);
    if (!servers[message.guild.id].hooked) {
        servers[message.guild.id] = {
            "hooked": true,
            connection: servers[message.guild.id].connection,
            queue: servers[message.guild.id].queue,
            dispatcher: servers[message.guild.id].dispatcher ? servers[message.guild.id].dispatcher : {}

        }
        if (server.dispatcher) server.dispatcher.pausedSince === null;
        console.log("NEW ishooked" + servers[message.guild.id].hooked);
        console.log("HOOKING");
        client.on('raw', event => {
            server = servers[message.guild.id];
            let mRCH = message.guild.channels.find(channel => channel.name === "music_req");
            if ((event.t === "MESSAGE_REACTION_ADD" || event.t === "MESSAGE_REACTION_REMOVE") && parseInt(mRCH.id) === parseInt(event.d.channel_id)) {
                if (message.guild.members.get(event.d.user_id).user.bot) return;
                if (event.d.emoji.name === "⏭") {
                    server.dispatcher.end();
                    server.dispatcher.pausedSince === null;
                }
                if (event.d.emoji.name === "⏹") {
                    console.log('leavee');
                    leave(message);
                }
                if (event.d.emoji.name === "⏯") {
                    console.log(["PAUSE", server.isPaused])
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
    if (args === "PLAY_MUSIC") {
        if (message.content.indexOf('youtube') || message.content.indexOf('youtu.be')) {
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
    }

    if (args === "PLAYLIST_PLAY") {
        playYT(message);
        // message.channel.messages.fetch().then((messages) => {
        //     console.log("CHANGE");
        //     messages = Array.from(messages);
        //     let secMsg = messages[messages.length - 2][1];
        //     let t = 0;
        //     let m = [];
        //     server.queue.map((el) => { if (t === 0) { t++; return; } else if (t > 20) { return; } else { t++; m.push(`${t - 1}. **${el.title}** __Length: ${el.length}__\n`); } })
        //     secMsg.edit(`***Queue List: \n*** ${m.join("")}`);
        // }).then();


    }
}