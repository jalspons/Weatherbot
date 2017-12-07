import TelegramBot from 'node-telegram-bot-api';
import weatherData from './weather.js';
import { token, apiKey } from './reference.json';

// Initializing the bot and testing
var bot = new TelegramBot(token, {polling: true});
bot.getMe().then(function(me) {
  console.log('Hi my name is %s!', me.username);
  console.log(parseMessage("pori", ["lampotila", "lumi", "sade"])); // Esimerkkikäyttö tuosta parseMessage
  });

// For combining the string for the message to be post ###  Vika on vissiin täs funktios noiden Promisen käytön kans.
const parseMessage = (place, parameters) => {
  var message = `Tänään sää ${place}:\n`;
  parameters.forEach( async p => {
    await fetchData(place, p)
    .then( data => {
      message += `${p}: ${data}`;
      console.log(`${p}: ${data}`);
    }) // ***************************
    .catch( err => console.log(err))
  });
  return message; // Palauttaa atm vaan tuon määrittelylauseen, Promiset jäävät hakematta/toteutumatta
};

// Fetching data from the database
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

// command /nyt [anything] TOIMII
bot.onText(/\/nyt (.+)/, (msg, match) => {
  var fromId = msg.from.id;
  var place = match[1];
  weatherData(place, "tday").then(data => {
    var message = `Tänään sää ${place}:\n`;
    message += `Lämpötila: ${data}\n`;
    bot.sendMessage(fromId, message);
  });
});

// command /saa <place> <params> EI TOIMI
bot.onText(/\/saa (.+)/, (msg, match) => {
  var fromId = msg.from.id;
  var input = match[1].split(" ");
  var place = input[0];
  var parameters = input.slice(1);
  bot.sendMessage( fromId, parseMessage(place,parameters) );
});
