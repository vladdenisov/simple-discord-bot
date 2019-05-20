const {
    parseUrll
} = require('./parseUrl');
module.exports.disp_control = async (server, message) => {
    server.dispatcher.on('end', async () => {
        console.log(server.queue);
        // if (server.queue[0] && !server.queue[1]) {
        //     message.member.voice.channel.leave();
        //     message.channel.send("Queue is clear. Leaving channel")
        // }
        if (server.queue[1]) {
            server.queue.shift();
            server.dispatcher = await parseUrll(server.queue[0].url, message, 'play');
            return 0;
        }

    })
    server.dispatcher.on('error', (error) => {
        console.log(error);
        server.queue.shift();
        parseUrll(server.queue[0], message, 'play');
    })
}