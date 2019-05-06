const config = require('./config.json');
const Discord = require('discord.js');
const {
  Client,
  Attachment
} = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const request = require('request');
const ytdl = require('ytdl-core');
const prefix = config.prefix;

client.on('ready', () => {
  console.log("Connected as " + client.user.tag)
  client.user.setActivity(config.game_name);
});

client.on('message', message => {
  if (message.type === "dm") return;
  if (message.author.bot) return;
  console.log(`--Recieved message from ${message.author.id}`);
  if (message.content === `${prefix}gay`) {
    message.reply("Mironov is gay");
  }
  if (message.content === `${prefix}ping`) {
    message.reply('Pong!');
  }
  if (message.content === 'споки') {
    message.reply('ноки');
  }
  if (message.content === 'споки ноки') {
    message.reply('руки в боки');
  }

  if (message.content.startsWith(`${prefix}clear`)) {
    const value = parseInt(message.content.match(/\S+/g)[1]);
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
        let text;
        if (value === 1) {
          text = "message"
        } else {
          text = "messages"
        };
        message.channel.send(`Successfully deleted ${value} ${text}`)
      })
    } else {
      message.channel.send("Command syntax: +clear {number of messages}");
    }
  }
  if (message.content.startsWith(`${prefix}votekick`)) {
    let counter = 0;
    const user = message.mentions.users.first();
    const member = message.guild.member(user);
    let votes = parseInt(message.content.slice(10));
    if (votes > 0) {
      message.reply(`You started vote to kick ${user.username}`);
      let users = [];
      client.on('message', msg => {
        if (msg.channel.id === message.channel.id) {
          if (msg.content === `${prefix}stopvote`) {
            if (msg.author.id === message.author.id) {
              msg.channel.send("Stopped voting");
            } else {
              msg.channel.send();
            }
          }
          if (msg.content === `${prefix}vote`) {
            if (users.indexOf(msg.author.id) === -1) {
              users.push(msg.author.id);
              counter++;
              msg.reply(`${counter}/${votes} votes`);
              msg.channel.send(`Need ${votes-counter} more!`);
            } else {
              msg.reply("You have already voted!");
            }
          }
          if (counter === votes) {
            counter++;
            console.log("need to kick");
            member.kick('Optional reason that will display in the audit logs').then(() => {
              message.reply(`Successfully kicked ${user.tag}`);
              return;
            }).catch(err => {
              message.reply('I was unable to kick the member');
              console.error(err);
              return;
            });
          }
        }
      })
      return;
    } else {
      message.channel.send("Command syntax: +votekick {votes to kick} {mention user to kick}")
    }
  }
  if (message.content.startsWith(`${prefix}weather`)) {
    let api_key = 'd06e8cb7114e462c8565676a8663aa86';
    let zip = parseInt(message.content.match(/\S+/g)[2]);
    let cc = message.content.match(/\S+/g)[1];
    fetch(`https://api.weatherbit.io/v2.0/current?postal_code=${zip}&country=${cc.toUpperCase()}&key=${api_key}`)
      .then(resp => resp.json()).then(resp => {
        //console.log(resp)
        const img_t = new Attachment(`https://www.weatherbit.io/static/img/icons/${resp.data[0].weather.icon}.png`);
        const desc = resp.data[0].weather.description;
        const tempt = resp.data[0].temp;
        const app_temp = resp.data[0].app_temp;
        message.channel.send(`It's ${tempt}°С there. Feels like ${app_temp}°C. And it's ${desc}!`, img_t);
      });
  }
  if (message.content.startsWith(`${prefix}anime`)) {
    request('https://api.jikan.moe/v3/search/anime/?q=Fate/Zero&page=1', function (error, response, body) {
      console.log('Status:', response.statusCode);
      console.log('Headers:', JSON.stringify(response.headers));
      console.log('Response:', body);
    });
  }
  if (message.content === `${prefix}join`) {
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => {
          message.reply('I have successfully connected to the channel!');
          client.on("message", msg => {
            if (msg.content.startsWith(`${prefix}play`)) {
              const dispatcher = connection.playStream(ytdl("https://www.youtube.com/watch?v=XNT9xyx1ZOs"));
            }
          })
        })
        .catch(console.log);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
  if (message.content === `${prefix}leave`) {
    if (message.member.voiceChannel) {
      message.member.voiceChannel.leave();
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }

});
client.login(config.token);