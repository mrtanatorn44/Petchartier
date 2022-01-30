const { Client, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

const config = require('./config');
const commands = require('./help');


// Crypto Currency
const dotenv = require('dotenv');
const axios = require('axios'); 	// New line that we added

// Command : uptime, uptimenow
let uptime_toggle = false;
var count_uptime_hour = 0;

// Command : timer
let isTimer = false;
let intervalTimer;

function isInt(str) {
  return !isNaN(str) && Number.isInteger(parseFloat(str));
}

let bot = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES"],
  fetchAllMembers: true, // Remove this if the bot is in large guilds.
  presence: {
    status: 'online',
    activity: {
      name: `${config.prefix}help`,
      type: 'LISTENING'
    }
  }
});

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}.`)

  var time_now;
  setInterval(function() {
    time_now = new Date();
    // bot.user.setActivity('Valorant', { type: 'Playing' });
    bot.user.setActivity(time_now.toLocaleTimeString());
  }, 5000);

  /*
  var d = new Date();
  console.log(d.toLocaleTimeString());
  console.log(d.toLocaleString());
  console.log(d.toLocaleDateString());
  */

});

  

bot.on('message', async message => {

  // Check for command
  if (message.content.startsWith(config.prefix)) {
    let args = message.content.slice(config.prefix.length).split(' ');
    let command = args.shift().toLowerCase();
    let msg = "";

    switch (command) {
      case 'timer':
        if (args.length !== 1) {
          message.reply(
            '[Timer] Try again! -> !timer [minutes]'
          );
        } else {
          if (args == 'off' && !isInt(args)) {
            if (isTimer) {
              message.channel.send({ content: '[Timer] Turn off!'});
              isTimer = false;
              clearInterval(intervalTimer);
            } else {
              message.channel.send({ content: '[Timer] Not set!'});
            }
          } else if (isInt(args)) {
            if (isTimer) {
              message.reply(
                '[Timer] Is running!'
              );
            } else {
              isTimer = true;
              message.channel.send({ content: `[Timer] Countdown ${args} minutes start!`});
              intervalTimer = setInterval(() => {
                message.channel.send({ content: '[Timer] Time out!'});
                clearInterval(intervalTimer);
                isTimer = false;
              }, args*60*1000);
            }
          } else {
            message.reply(
              '[Timer] Try again! -> !timer [integer]'
            );
          }
        }

        break;
      case 'price':

        if (args.length !== 2) {
          message.reply(
            'You must provide the crypto and the currency to compare with!'
          );
        } else {
          const [coin, vsCurrency] = args;
          try {
            // Get crypto price from coingecko API
            const { data } = await axios.get(
              `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${vsCurrency}`
            );
            // Check if data exists
            if (!data[coin][vsCurrency])
              throw Error();

            message.reply(
              `The current price of 1 ${coin} = ${data[coin][vsCurrency]} ${vsCurrency}`
            );
          } catch (err) {
            return message.reply(
              'Please check your inputs. For example: !price bitcoin usd'
            );
          }
        }
        break;

      case 'porn':
        message.channel.send({ content: 'No horny! :point_left:', files: ['./images/nohorny.png'] });
        break;
        
      case 'uptimenow':
        let totalSeconds = (bot.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        message.channel.send({ content: `[Uptime] ${uptime} :white_check_mark:`});
        break;
      
      case 'ping':
        msg = await message.reply('Pinging...');
        await msg.edit(`[PING] ${Date.now() - msg.createdTimestamp}ms.`)
        break;
      
      case 'tawan':
        message.channel.send({ 
          content: 'ตาหวานๆ :eyes:', 
          files: ['./images/tawan.png'] 
        });
        break;

      case 'clearchat':
        if (message.member.permissions.has("ADMINISTRATOR")) {
          let fetched;
          let removed = 0;

          do {
            fetched = await message.channel.messages.fetch({limit: 100});
            if (fetched.size == 0)
              break;
            // console.log("Fetch : " + fetched.size);
            await message.channel.bulkDelete(fetched.size)
              .then(removed += fetched.size)
              .catch(console.error);       
          } while(fetched.size > 1);

          message.channel.send({ content: `Delete ${removed} messages` });
        } else {
          message.reply('You don\'t have permission!');
        } 
        break;

      case 'say':

      case 'repeat':
        if (args.length > 0)
          message.channel.send(args.join(' '));
        else
          message.reply('You did not send a message to repeat, cancelling command.')
        break

      case 'help':
        let embed =  new MessageEmbed()
          .setTitle('HELP MENU')
          .setColor('GREEN')
          .setFooter(`Requested by: ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setThumbnail(bot.user.displayAvatarURL());
        if (!args[0])
          embed
            .setDescription(Object.keys(commands).map(command => `\`${command.padEnd(Object.keys(commands).reduce((a, b) => b.length > a.length ? b : a, '').length)}\` :: ${commands[command].description}`).join('\n'));
        else {
          if (Object.keys(commands).includes(args[0].toLowerCase()) || Object.keys(commands).map(c => commands[c].aliases || []).flat().includes(args[0].toLowerCase())) {
            let command = Object.keys(commands).includes(args[0].toLowerCase())? args[0].toLowerCase() : Object.keys(commands).find(c => commands[c].aliases && commands[c].aliases.includes(args[0].toLowerCase()));
            embed
              .setTitle(`COMMAND - ${command}`)

            if (commands[command].aliases)
              embed.addField('Command aliases', `\`${commands[command].aliases.join('`, `')}\``);
            
            embed
              .addField('DESCRIPTION', commands[command].description)
              .addField('FORMAT', `\`\`\`${config.prefix}${commands[command].format}\`\`\``);
          } else {
            embed
              .setColor('RED')
              .setDescription('This command does not exist. Please use the help command without specifying any commands to list them all.');
          }
        }
        message.channel.send(embed);
        break;

    }
  }
});

bot.login(config.token);