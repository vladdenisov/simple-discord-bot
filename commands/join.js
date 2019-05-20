const {
    join
} = require('../utils/join');

exports.run = async (client, message, args) => {
    join(client, message, args);
}