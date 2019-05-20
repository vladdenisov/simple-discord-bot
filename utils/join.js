module.exports.join = async (message, callback) => {
    return new Promise((resolve, reject) => {
        if (message.member.voice.channel) {
            if (servers[message.guild.id]) {
                if (servers[message.guild.id].connection.channel.id === message.member.voice.channel) {
                    console.log(servers[message.guild.id]);
                    resolve(servers[message.guild.id]);
                }
            }
            message.member.voice.channel.join()
                .then(connection => {
                    console.log("Server: " + connection.channel.id);
                    console.log("Member: " + message.member.voice.channel)
                    message.reply('I have successfully connected to the channel!');
                    if (!servers[message.guild.id]) {
                        servers[message.guild.id] = {
                            queue: [],
                            connection: connection
                        }
                    } else servers[message.guild.id] = {
                        connection: connection,
                    }

                }).then(() => {
                    resolve(servers[message.guild.id]);
                })
                .catch(console.log);

        } else {
            message.reply('You need to join a voice channel first!');
        }
    })

}