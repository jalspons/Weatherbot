import TelegramBot from 'node-telegram-bot-api';
import weatherData from './weather.js';
import { token, apiKey } from './reference.json';


var bot = new TelegramBot(token, {polling: true});
bot.getMe().then(function(me) {
  console.log('Hi my name is %s!', me.username);
  var parameters = ["lampotila", "lumi", "sade"];
  var place = "pori"
  console.log(parseMessage(place, parameters));
  });

const parseMessage = (place, parameters) => {
  var message = `Tänään sää ${place}:\n`;
  var dict = {};
  for (var p in parameters) {
    fetchData(place, p)
    .then( data => console.log(data[data.length - 1]));
  });
  for (var p in dict) {
    message += `${p}: ${dict[p]}`;
  };
  console.log(message);
  return message;
  };

const fetchData = (place, param) => {
    switch(param) {
        case "lampotila":
          return weatherData(place, "tday");
        case "lumi":
          return weatherData(place, "snow");
        case "sade":
          return weatherData(place, "rrday");
    };
};


 // command /start
bot.onText(/\/start/, function (msg, match) {
  var fromId = msg.from.id;
  var message = "Welcome to hear my stories about the weather :)\n";
  message += "Get more stories by sending /weather [your_city] command."
  bot.sendMessage(fromId, message);
});

// command /nyt [anything]
bot.onText(/\/nyt (.+)/, (msg, match) => {
  var fromId = msg.from.id;
  var place = match[1];
  weatherData(place, "tday").then(data => {
    var message = `Tänään sää ${place}:\n`;
    message += `Lämpötila: ${data[data.length - 1]}\n`;
    bot.sendMessage(fromId, message);
  });
});

bot.onText(/\/saa (.+)/, (msg, match) => {
  var fromId = msg.from.id;
  var input = match[1].split(" ");
  var place = input[0];
  var parameters = input.slice(1);
  bot.sendMessage( fromId, parseMessage(place,parameters) );
});
