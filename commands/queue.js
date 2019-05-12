const ytdl = require('ytdl-core');
const discord = require('discord.js');
exports.run = async (client, message, args) => {
    const server = servers[message.guild.id];
    if (!server) {
        message.channel.send(`I need to join channel first`);
    }
    if (!server.queue || server.queue === []) {
        message.channel.send(`Queue is clear`);
    }
    if (args[0]) {
        const song_name = await ytdl.getInfo(server.queue[args[0] - 1]);
        message.channel.send(`${song_name.title} is on ${args[0]} position`);
    } else {

        let qEmb = new discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Queue')
            .setTimestamp()
            .addField("*Entries:*", `*${server.queue.length - 1}*`);
        var queue = Promise.resolve(); // in ES6 or BB, just Promise.resolve();
        let songs = [];
        let c = 1;
        server.queue.forEach(function (el) {
            queue = queue.then(async function (res) {
                if (c > 11) return;
                const song_name = await ytdl.getInfo(String(el));
                if (c === 1) {
                    c++;
                    return;
                } else {
                    // songs.push(song_name.title);
                    // console.log(songs);
                    qEmb.addField(`${c - 1}. ${song_name.title}`, ` [Youtube](${el})`);
                    c++;
                    return;
                }


            });
        });
        queue.then(async function (lastResponse) {
            const song_name = await ytdl.getInfo(String(server.queue[0]));
            qEmb.addField(`Now Playing`, `[${song_name.title}](${server.queue[0]})`);
            message.channel.send(qEmb);
        });

        //         queue.then(function (lastResponse) {
        //             message.channel.send(`
        // __**Song queue:**__
        // ${songs.map(song => `**-** ${song}`).join('\n')}

        // 		`)
        //         });
    }
}