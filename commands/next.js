exports.run = async (client, message, args) => {
    let server = servers[message.guild.id];
    let song;
    // disp_control(server, message);
    if (parseInt(args[0])) {
        song = server.queue[parseInt(args[0])];
    } else song = server.queue[0];
    console.log(server.queue);
    if (server === undefined) {
        message.reply(`You need to run ${prefix}join command first, even if i'm in channel`);
        return;
    }
    if (server.queue[0] && !server.queue[1]) {
        server.dispatcher.end();
    }
    if (server.queue[1]) {
        server.dispatcher.end();
        console.log("Playing next");
    } else {
        return;
    }
}