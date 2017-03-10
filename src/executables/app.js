/////////////////////////
// app.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

const express        = require('express'),
      request        = require('request'),
      bodyParser     = require('body-parser'),
      MessageHandler = require('../services/ai/MessageHandler.js'),
      os             = require('os'),
      app            = express();

//
// Todo: make this not suck
//
const handler = new MessageHandler();

// -- chatbot framework --
// Q: who should decide to sendTextMessage() and who should actually call sendTextMessage()?
// A: the chatbot framework should provide interfaces to send messages back to user. there can be multiple types of these depending on what you want to send (text, pictures, etc.)
// --
// chatbot is a brain
// it 1. parses a message, 2. formulates a response, 3. delivers the response
// you have to teach it how to do all these things.
// teach it to extract an intent from a message
// teach it to associate responses with these extracted intents
// associated responses should have a type (should contain information on how to deliver that response)
// --
// message reaction = intent + ability
// 1. load abilities - now have a set of abilities
//     - abilities should always return an OBJECT that will be sent to the respective chatbot response function
// 2. load expected messages - now have a set of things we can respond to
// 3. register ability to each expected message
// 4. on messaging event, extract intent
// 5. lookup ability via registry and then call the ability with the event as param

//
// Init port in app table and process the url and json parsers
//
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//
// Server request and webhook handlers.
//
app.get('/', (req, res) => {
    // Default http GET response. Use for testing.
    res.send('Hi my name is BitcoinBot! I like talking about the future of money :)');
});

app.get('/webhook', (req, res) => {
    // Validate webhook subscription from client.
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.GRAPH_VERIFY_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    }
    else{
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);          
    }  
});

app.post('/webhook', (req, res) => {
    // Webhook for messages events.
    let data = req.body;
    if (data.object === 'page') {
        data.entry.forEach((entry) => {
            let pageID = entry.id;
            let timeOfEvent = entry.time;

            // iterate over each messaging event
            entry.messaging.forEach((event) => {
                if (event.message) {
                    handler.onReceievedMessage(event);
                }
                else{
                    console.log('Received unknown event:', event);
                }
            });
        });
        res.sendStatus(200);
    }
});

app.listen(app.get('port'), () => {
    console.log(`listening at http:\/\/localhost:${app.get('port')}`);
});