import TelegramBot        from 'node-telegram-bot-api'
import weatherData        from './weather.js'
import { token, apiKey }  from './reference.json'

// Initializing the bot and testing
let bot = new TelegramBot(token, {polling: true})
bot.getMe().then(function(me) {
  console.log('Hi my name is %s!', me.username)
  console.log(parseMessage("pori", ["lampotila", "lumi", "sade"])) // Esimerkkikäyttö tuosta parseMessage
  })

/* // For combining the string for the message to be post ###  Vika on vissiin täs funktios noiden Promisen käytön kans.
const parseMessage = (place, parameters) => {
  let message = `Tänään sää ${place}:\n`
  parameters.forEach( async p =>  { return await fetchData(place, p) })
    .then( data => message += `${p}: ${data}\n` )
    .then( () => { return message }) // Palauttaa atm vaan tuon määrittelylauseen, Promiset jäävät hakematta/toteutumatta
    .catch( err => console.log(err) )

}
*/

// For combining the string for the message to be post ###  Vika on vissiin täs funktios noiden Promisen käytön kans.
const parseMessage = async (place, parameters) => {
    let message = `Tänään sää ${place}:\n`
    const test = await Promise.all(parameters.map((e) => fetchData(place, e)))
    for (let x = 0; x < parameters.length; x++) { message += `${parameters[x]}: ${test[x]}` }
    return message // Palauttaa atm vaan tuon määrittelylauseen, Promiset jäävät hakematta/toteutumatta
}

// Fetching data from the database
const fetchData = (place, param) => {
    switch(param) {
        case "lampotila":
          return weatherData(place, "tday")
        case "lumi":
          return weatherData(place, "snow")
        case "sade":
          return weatherData(place, "rrday")
    }
}

 // command /start
bot.onText(/\/start/, function (msg, match) {
  let fromId = msg.from.id;
  let message = "Welcome to hear my stories about the weather :)\n";
  message += "Get more stories by sending /weather [your_city] command.\n"
  message += "Type /help <command> to get more information about the command."
  bot.sendMessage(fromId, message)
})

// command /nyt [anything] TOIMII
bot.onText(/\/nyt (.+)/, (msg, match) => {
  let fromId = msg.from.id
  let place = match[1]
  weatherData(place, "tday").then(data => {
    let message = `Tänään sää ${place}:\n`
    message += `Lämpötila: ${data}\n`
    bot.sendMessage(fromId, message)
  })
})

// command /saa <place> <params> EI TOIMI
bot.onText(/\/saa (.+)/, (msg, match) => {
  let fromId = msg.from.id
  let input = match[1].split(" ")
  let place = input[0]
  let parameters = input.slice(1)
  bot.sendMessage( fromId, parseMessage(place,parameters) )
})
