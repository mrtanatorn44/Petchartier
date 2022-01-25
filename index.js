const { Client, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

const config = require('./config');
const commands = require('./help');


// Require dependencies
const dotenv = require('dotenv');
const axios = require('axios'); 	// New line that we added

// COMMAND case uptime
let uptime_toggle = false;
var count_uptime_hour = 0;

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

bot.on('ready', () => console.log(`Logged in as ${bot.user.tag}.`));

bot.on('message', async message => {
  // Check for command
  if (message.content.startsWith(config.prefix)) {
    let args = message.content.slice(config.prefix.length).split(' ');
    let command = args.shift().toLowerCase();
    let msg = "";

    if (message.content.startsWith('!price')) {
      // Get the params
      const [command, ...args] = message.content.split(' ');
  
      // Check if there are two arguments present
      if (args.length !== 2) {
        return message.reply(
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
          if (!data[coin][vsCurrency]) throw Error();
  
          return message.reply(
            `The current price of 1 ${coin} = ${data[coin][vsCurrency]} ${vsCurrency}`
          );
        } catch (err) {
          return message.reply(
            'Please check your inputs. For example: !price bitcoin usd'
          );
        }
      }
    }

    let uptime = false;
    switch (command) {

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
      
      case 'uptime':

        var checkminutes = 60, checkthe_interval = checkminutes * 60 * 1000; 
        //This checks every 10 minutes, change 10 to whatever minute you'd like
        
        setInterval(function() {
          count_uptime_hour += 1;
          if (uptime_toggle) {
            message.channel.send({ content: `[Uptime] ${count_uptime_hour} hours :white_check_mark:`});      
          }
        }, checkthe_interval);

        if (uptime_toggle) {
          uptime_toggle = false;
          message.channel.send({ content: '[Uptime notification] OFF'});       
        } else {
          uptime_toggle = true;
          message.channel.send({ content: '[Uptime notification] ON'});
        }

        break;

      case 'ping':
        msg = await message.reply('Pinging...');
        await msg.edit(`[PING] ${Date.now() - msg.createdTimestamp}ms.`)
        break;
      
      case 'tawan':
        //msg = await message.reply('Sending...');
        message.channel.send({ content: 'ตาหวานๆ :eyes:', files: ['./images/tawan.png'] });
        break;

      case 'clearchat':
        if (message.member.permissions.has("ADMINISTRATOR")) {

          let fetched;
          let removed = 0;

          do {

            fetched = await message.channel.messages.fetch({limit: 100});
            if (fetched.size == 0)
              break;
            //console.log("Fetch : " + fetched.size);
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

      /* Unless you know what you're doing, don't change this command. */
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