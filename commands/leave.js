exports.run = (client, message, args) => {
    message.member.voice.channel.leave();
}