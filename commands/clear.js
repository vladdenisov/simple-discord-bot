exports.run = (client, message, args) => {
    const value = parseInt(args[0]);
    if (value >= 1) {
        message.channel.fetchMessages({
            limit: value + 1
        }).then(messages => {
            messages_resp = messages;
            messages.map(msg => {
                message.channel.fetchMessage(msg.id).then(msg => msg.delete()).catch(err => {
                    message.channel.send("Unable to delete message");
                    setTimeout(function () {
                        message.channel.fetchMessage(message.channel.fetchMessages().first().id).delete();
                    }, 2000);
                });
            })
            async function textS() {
                let text;
                if (value === 1) {
                    text = "message"
                } else {
                    text = "messages"
                };
                message.channel.send(`Successfully deleted ${value} ${text}`);
            }
            textS();

        })
    } else {
        message.channel.send("Command syntax: +clear {number of messages}");
    }
}