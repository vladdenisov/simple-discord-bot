const {
    answer_en,
    answer_ru
} = require('../json/8ball.json');
const {
    prefix
} = require('../json/config.json');
exports.run = (client, message, args) => {
    const min = 0;
    let json;
    if (!args[0]) {
        message.reply(`Please, Ask a question. Command syntax: ${prefix}8ball {"RU" to use russian language} {question}`);
        return;
    }
    if (args[0] === "ru") json = answer_ru;
    else json = answer_en;
    const max = json.length + 1;
    const random = Math.round(Math.random() * (max - min) + min);
    console.log(random);
    message.reply(json[random]);
};