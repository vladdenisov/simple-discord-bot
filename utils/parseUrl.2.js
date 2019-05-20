const ytdl = require('ytdl-core');
const {
    playSong
} = require('./youtube');

const ytParse = async (url, message, type) => {
    return new Promise(async (resolve, reject) => {
        let info;
        let server = servers[message.guild.id];
        let name;
        if (type === "play") {
            playSong(message);
            resolve(server.dispatcher);
            return;
        }
        try {
            info = await ytdl.getBasicInfo(url);
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
                    let disp = await playSong(message);
                    resolve(disp);
                    return;
                }
                message.reply(`Added ${info.title} to queue on ${server.queue.length - 1} position`)
                resolve(server.dispatcher);
            } else {
                console.log('1');
            }
        }
    })

}

const SCparse = async (url, message) => {

}
module.exports.ytParse = ytParse;
module.exports.parseUrll = async function parseUrll(url, message, type) {
    return new Promise(async (resolve, reject) => {
        console.log(url);

        if (url.indexOf('youtube') || url.indexOf('youtu.be')) {
            let a = await ytParse(url, message, type);
            resolve(a);
        }
    })


}