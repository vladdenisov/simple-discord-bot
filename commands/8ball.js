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
    let max = json.length + 1;
    if (args[1] === "Слава") {
        if (args[2] === "пидор" || args[2] === "пидор?") {
            max = 5;
        }
    }
    let random = Math.round(Math.random() * (max - min) + min);
    console.log(random);
    random = random === 0 ? 1 : random;
    message.reply(json[random - 1]);
};