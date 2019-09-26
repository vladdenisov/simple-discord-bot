module.exports.join = async (message, callback) => {
    return new Promise((resolve, reject) => {
        if (message.member.voice.channel) {
            if (servers[message.guild.id]) {
                if (servers[message.guild.id].connection.leave !== true) {
                    if (servers[message.guild.id].connection.channel.id === message.member.voice.channel) {
                        console.log(servers[message.guild.id]);
                        resolve(servers[message.guild.id]);
                    }
                }
            }
            message.member.voice.channel.join()
                .then(connection => {
                    console.log("Server: " + connection.channel.id);
                    console.log("Member: " + message.member.voice.channel)
                    // message.reply('I have successfully connected to the channel!');
                    if (!servers[message.guild.id]) {
                        servers[message.guild.id] = {
                            queue: [],
                            connection: connection,
                            isPaused: false
                        }
                    } else {
                        servers[message.guild.id] = {
                            "hooked": servers[message.guild.id].hooked,
                            connection: connection,
                            queue: servers[message.guild.id].queue,
                            "isPaused": false
                        }
                    }

                }).then(() => {
                    resolve(servers[message.guild.id].connection);
                })
                .catch(console.log);

        } else {
            message.reply('You need to join a voice channel first!');
        }
    })

}