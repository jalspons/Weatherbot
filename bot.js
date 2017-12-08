import TelegramBot             from  'node-telegram-bot-api'
import parseWeatherMessage     from  './weather.js'
import generateHelp            from  './help.js'
import { token }               from  './reference.json'

// Initializing the bot and testing
let bot = new TelegramBot(token, {polling: true})
bot.getMe().then( me => {
  console.log('Hi my name is %s!', me.username)
})

 // command /start
bot.onText(/\/start/, (msg, match) => {
  let fromId = msg.from.id;
  let message = ( "Welcome to hear my stories about the weather :)\n" +
  "Get more stories by sending /weather [your_city] command.\n" +
  "Type /help <command> to get more information about the command." )
  bot.sendMessage(fromId, message)
})

// command /help <command> i.e. /help sää
bot.onText(/\/help (.+)/, (msg, match) => {
  let id = msg.from.id
  let param = match[1]
  bot.sendMessage(id, generateHelp(param))
})

// command /saa <place> <params>
bot.onText(/\/sää (.+)/, (msg, match) => {
  let fromId = msg.from.id
  let input = match[1].split(" ")
  let place = input[0]
  let parameters = []
  if (input.length === 1) {
      parameters = ["lämpötila"]
  } else {
    parameters = input.slice(1)
  }
  parseWeatherMessage(place, parameters)
    .then( msg => bot.sendMessage(fromId, msg))
})
