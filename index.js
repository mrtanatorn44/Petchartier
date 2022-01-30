const { Client, MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const dotenv = require('dotenv');
const axios = require('axios'); 	// New line that we added
const config = require('./config');
const commands = require('./help');

// Command : uptime
let uptime_toggle = false;
var count_uptime_hour = 0;

// Command : timer
let isTimer = false;
let intervalTimer;

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
        command_timer(message, args, command, msg);
        break;
      case 'ts':
        command_translator(message, args, command, msg);
        break;
      case 'price':
        command_cryptoprice(message, args, command, msg);
        break;
      case 'porn':
        command_nohorny(message, args, command, msg);
        break;
      case 'uptime':
        command_uptime(message, args, command, msg);
        break;
      case 'ping':
        command_ping(message, args, command, msg);
        break;
      
      case 'tawan':
        command_tawan(message, args, command, msg);
        break;

      case 'clearchat':
        command_clearchat(message, args, command, msg);
        break;

      case 'say':

      case 'repeat':
        command_repeat(message, args, command, msg);
        break

      case 'help':
        command_help(message, args, command, msg);
        break;

    }
  }
});

// FUNCTION NORMAL
function isInt(str) {
  return !isNaN(str) && Number.isInteger(parseFloat(str));
}

// FUNCTION COMMAND

function command_timer(message, args, command, msg) {
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
}

function command_translator(message, args, command, msg) { 

  var lang_pair;

  if (args.length == 0) {
    message.reply(
      '[Translator] You must provide word to translate'
    );
  } else {
    var word = args.join();
    var word_th = (word.match(/[ก-ฮ]/g) || []).length;
    var word_en = (word.match(/[a-z]/g) || []).length + (word.match(/[A-Z]/g) || []).length;
    if (word_en && word_th) { 
      message.reply(
        '[Translator] You must choose only one language!'
      );
      return;
    } else if (word_en != 0 && word_th == 0) {
      lang_pair = 'en|th';
    } else if (word_en == 0 && word_th  != 0) {
      lang_pair = 'th|en';
    } else {
      message.reply(
        '[Translator] Error found!'
      );
    }

    /*
    message.reply(
      `EN: ${word_en}  TH: ${word_th}`
    );
    */

    var options = {
      method: 'GET',
      url: 'https://translated-mymemory---translation-memory.p.rapidapi.com/api/get',
      params: {langpair: lang_pair, q: word, mt: '1', onlyprivate: '0', de: 'a@b.c'},
      headers: {
        'x-rapidapi-host': 'translated-mymemory---translation-memory.p.rapidapi.com',
        'x-rapidapi-key': config.rapid_api_key
      }
    };
    
    axios.request(options).then(function (response) {
      message.channel.send({ content: response.data.responseData.translatedText});
    }).catch(function (error) {
      message.reply(
        '[Translator] Error Found!'
      );
      console.error(error);
    });
  }
}

async function command_cryptoprice(message, args, command, msg) { 
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
}

function command_nohorny(message, args, command, msg) { 
  message.channel.send({ content: 'No horny! :point_left:', files: ['./images/nohorny.png'] });
}

function command_uptime(message, args, command, msg) { 
  let totalSeconds = (bot.uptime / 1000);
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);
  let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
  message.channel.send({ content: `[Uptime] ${uptime} :white_check_mark:`});
}

async function command_ping(message, args, command, msg) { 
  msg = await message.reply('Pinging...');
  await msg.edit(`[PING] ${Date.now() - msg.createdTimestamp}ms.`)
}

function command_tawan(message, args, command, msg) { 
  message.channel.send({ 
    content: 'ตาหวานๆ :eyes:', 
    files: ['./images/tawan.png'] 
  });
}

async function command_clearchat(message, args, command, msg) { 
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
}

function command_repeat(message, args, command, msg) { 
  if (args.length > 0)
    message.channel.send(args.join(' '));
  else
    message.reply('You did not send a message to repeat, cancelling command.')
}

function command_help(message, args, command, msg) { 
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
}

bot.login(config.token);