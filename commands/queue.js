const discord = require('discord.js');
exports.run = async (client, message, args = ['pg', '0']) => {
    message.delete();
    if (!args[0]) args = ['pg', '1'];
    const server = servers[message.guild.id];
    if (!server) {
        message.channel.send(`I need to join channel first`).then((m) => setTimeout(() => m.delete(), 2000));
    }
    if (!server.queue || server.queue === []) {
        message.channel.send(`Queue is clear`).then((m) => setTimeout(() => m.delete(), 2000));
    }
    if (args[0] === 'rm') {
        if (!args[1]) {
            message.reply("Provide a number of song to remove").then((m) => setTimeout(() => m.delete(), 2000));
            return;
        }
        if (server.queue[parseInt(args[1])]) {
            let s_name = server.queue[parseInt(args[1])].title;
            server.queue.splice(parseInt(args[1]), 1);
            message.channel.send(`Successfully removed ${s_name} from position ${args[1]}`).then((m) => setTimeout(() => m.delete(), 2000));
            return;
        }
    }
    if (args[0] === 'mv') {
        if (!args[1]) {
            message.reply("Provide a number of song to remove").then((m) => setTimeout(() => m.delete(), 2000));
            return;
        }
        if (server.queue[parseInt(args[1])] && server.queue[parseInt(args[2])]) {
            let t = server.queue[parseInt(args[1])];
            server.queue[parseInt(args[1])] = server.queue[parseInt(args[2])];
            server.queue[parseInt(args[2])] = t;
            message.channel.send("Successfully changed `" + t.title + "` to `" + server.queue[parseInt(args[1])].title + "` position").then((m) => setTimeout(() => m.delete(), 2000));
            return;
        }
    }
    if (args[0] === 'pg') {
        let num = (args[1]) ? parseInt(args[1]) : 1;
        let qEmb = new discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Queue')
            .setTimestamp()
            .addField("*Entries:*", `*${server.queue.length - 1}*`);
        var queue = Promise.resolve();
        let songs = [];
        let cmax
        let cm = num * 10;
        let c = cm - 9;
        if (num === 1) {
            c = 1;
            cm = 10;
        }
        queue.then(async function (res) {
            for (i = c; i <= cm; i++) {
                let song = server.queue[i];
                qEmb.addField(`${i}. ${song.title}`, ` [YouTube](${song.url})`);
            }
        })

        queue.then(async function (lastResponse) {
            qEmb.addField(`Now Playing`, `[${server.queue[0].title}](${server.queue[0].url})`);
            message.channel.send(qEmb);
        });
    }
}