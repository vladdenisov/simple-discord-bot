exports.run = (client, message, args) => {
    let server = servers[message.guild.id];
    server.dispatcher.resume();
}