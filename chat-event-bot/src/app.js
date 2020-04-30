'use strict'

const request = require('request')
const urlApi = 'http://localhost:3001/allevents'
const Telegram = require("telegram-node-bot") // Chamando a lib para utilizat o bot do telegram
const TelegramBaseController = Telegram.TelegramBaseController // Chamando classe de controle
const TextCommand = Telegram.TextCommand //pegar os comandos que o nosso usuário digitar no Telegram
const chatbot = require('../config/config')

class EventsController extends TelegramBaseController {
    sendMessage(scope, msg) {
        scope.sendMessage(msg)
    }

    // allEventsAction() envia a mensagem para o nosso chatbot
    allEventsAction(scope) {
        //let pathApi = '/allevents'
        let msg = ''

request(urlApi, (error, resp, body) => {
        msg = JSON.parse(body).map((event) => `${event.data.toString().replace(/,/g, ' e ')} - 
        ${event.name} \n ${event.link}\n`)
        this.sendMessage(scope, msg.toString().replace(/,/g, ''))
        if (error) {
            console.log('Problem in the api...')
        }
        })
    }

    // get routes() expor o método allEventsAction para o nosso chatbot
    // ajuda nosso chatbot a executar do lado de fora da controller o método allEventsAction
get routes() {
    return {
        'allEvents':'allEventsAction' 
        }
    } 
}  

// acha os comandos que o usuário digita e log, na sequência, 
// invoca o allEvents, isso se o comando que o usuário digitou for /allevents.
chatbot.router
    .when(
        new TextCommand('/allevents', 'allEvents'), 
        new EventsController()
    )