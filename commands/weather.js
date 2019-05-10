const {
    api_w
} = require('../json/config.json');
const request = require('request');
const {
    MessageAttachment
} = require('discord.js');

exports.run = (client, message, args) => {
    let zip = parseInt(args[0]);
    let cc = args[1];
    request(`https://api.weatherbit.io/v2.0/current?postal_code=${zip}&country=${cc.toUpperCase()}&key=${api_w}`, function (error, response, body) {
        body = JSON.parse(body);
        const img_t = new MessageAttachment(`https://www.weatherbit.io/static/img/icons/${body.data[0].weather.icon}.png`);
        const desc = body.data[0].weather.description;
        const tempt = body.data[0].temp;
        const app_temp = body.data[0].app_temp;
        message.channel.send(`It's ${tempt}°С there. Feels like ${app_temp}°C. And it's ${desc}!`, img_t);
    });
}