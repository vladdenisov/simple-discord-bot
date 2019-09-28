var request = require('request');
var fetch = require('node-fetch');
exports.run = async (client, message, args) => {
    if (args[0] === 'link') {
        // request({ url: args[1], json: true }, (err, response, body) => {
        //     if (!error && response.statusCode === 200) {
        //         console.log(body);
        //     }
        // })
        // fetch(args[1])
        //     .then(res => res.json())
        //     .then((json) => {
        //         console.log(json);
        //         // json = JSON.parse(json);


        //     });
        const embed = await fetch(args[1]).then(response => response.json());
        console.log(typeof (embed))
        message.channel.send(embed);
    }
    if (args[0] === "ftb") {
        const embed = {
            "title": "**Life in the village**",
            "description": "```\n1. Заходим в папку .minecraft \n2. У нас два варианта \n 2.1 Или удалить папки animation, changelogs, config, mods, resources, scripts \n 2.2 или удалить все папки (для тупых) \n3. Распаковываем архив прямо в ./minecraft \n4. Советую выделить память для майнкрафта около 5ГБ в Tlauncher \n6. Играть```",
            "url": "https://ftb.gamepedia.com/FTB_Ultimate_Reloaded",
            "color": "#0652DD",
            "timestamp": "2019-09-13T20:32:51.431Z",
            "author": {
                "name": "iPoGramme"
            },
            "fields": [
                {
                    "name": "**Скачать моды:**",
                    "value": "https://yadi.sk/d/hqiApon_KugI4Q"
                },
                {
                    "name": "**IP:**",
                    "value": "__**163.172.136.79**__"
                },
                {
                    "name": "**Версия:**",
                    "value": "__**ForgeOptifine1.12.2**__"
                },
                {
                    "name": "**Прохождения:**",
                    "value": "[Русский](https://www.youtube.com/watch?v=U2_Yx2gbZis)"
                }
            ]
        };
        message.channel.send({ embed });
    }
} 