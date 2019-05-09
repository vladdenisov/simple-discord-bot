exports.run = async (client, message, args) => {
    if (message.member.voice.channel) {
        message.member.voice.channel.join()
            .then(connection => {
                message.reply('I have successfully connected to the channel!');
                if (!servers[message.guild.id]) {
                    servers[message.guild.id] = {
                        queue: [],
                        connection: connection
                    }
                } else servers[message.guild.id] = {
                    connection: connection,
                    queue: []
                }

            })
            .catch(console.log);
    } else {
        message.reply('You need to join a voice channel first!');
    }
}