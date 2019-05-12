const {
    api_wb,
    api_wm
} = require('../json/config.json');
const request = require('request');
const {
    MessageAttachment,
    MessageEmbed
} = require('discord.js');

exports.run = (client, message, args) => {
    let zip = parseInt(args[0]);
    let cc = args[1];
    if (args[0] === "wm") {
        zip = parseInt(args[1]);
        cc = args[2];
        request(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},${cc}&appid=${api_wm}&units=metric`, function (error, response, body) {
            body = JSON.parse(body);
            let sunset = new Date(body.sys.sunset);
            let sunrise = new Date(body.sys.sunrise);
            let msgEmb = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Weather in ${body.name}`)
                .setTimestamp()
                .addField("Description", `${body.weather[0].description}`)
                .addField("Wind Speed", `${body.wind.speed}m/s`)
                .addField("Sunrise", `${sunrise.getHours()}:${sunrise.getMinutes()}`, true)
                .addField("Sunset", `${sunset.getHours()}:${sunset.getMinutes()}`, true)
                .addBlankField()
                .addField("Temperature", `${body.main.temp}°С`, true)
                //.addField("Feels like", `${app_temp}°С`, true)
                .setThumbnail(`http://openweathermap.org/img/w/10d.png`);
            //message.channel.send(`It's ${tempt}°С there. Feels like ${app_temp}°C. And it's ${desc}!`, img_t);
            message.channel.send(msgEmb);
        })
        return;
    }
    if (args[0] === 'wb') {
        zip = parseInt(args[1]);
        cc = args[2];
    }
    request(`https://api.weatherbit.io/v2.0/current?postal_code=${zip}&country=${cc.toUpperCase()}&key=${api_wb}`, function (error, response, body) {
        body = JSON.parse(body);
        const img_t = new MessageAttachment(`https://www.weatherbit.io/static/img/icons/${body.data[0].weather.icon}.png`);
        const desc = body.data[0].weather.description;
        const tempt = body.data[0].temp;
        const app_temp = body.data[0].app_temp;
        const wind_dir = body.data[0].wind_cdir;
        const wind_spd = body.data[0].wind_spd;
        let msgEmb = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Weather')
            .setTimestamp()
            .addField("Description", `${desc}`)
            .addField("Wind Direction", `${wind_dir}`, true)
            .addField("Wind Speed", `${wind_spd}m/s`, true)
            .addBlankField()
            .addField("Temperature", `${tempt}°С`, true)
            .addField("Feels like", `${app_temp}°С`, true)
            .setThumbnail(`https://www.weatherbit.io/static/img/icons/${body.data[0].weather.icon}.png`);
        //message.channel.send(`It's ${tempt}°С there. Feels like ${app_temp}°C. And it's ${desc}!`, img_t);
        message.channel.send(msgEmb);
    });
}