/////////////////////////
// app.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

const express        = require('express'),
      request        = require('request'),
      bodyParser     = require('body-parser'),
      BitcoinGuru    = require('./lib/BitcoinGuru.js'),
      FacebookGraph  = require('./lib/FacebookGraph.js'),
      MessageHandler = require('./lib/MessageHandler.js'),
      os             = require('os'),
      app            = express();

//
// Macros
//
const CB_CREDS              = 'public',
      FB_SEND_URI           = 'https://graph.facebook.com/v2.8/me/messages',
      FB_GENERIC_API_URI    = 'https://graph.facebook.com/v2.8/',
      ERROR_RESPONSE_STR    = 'Oops, something went wrong. Try again later...',
      DEFAULT_RESPONSE_STR  = 'Sorry, I don\'t know what that means. Say "help" for more info!',
      USER_PROFILE_OPTIONS  = 'first_name,last_name,profile_pic,locale,timezone,gender',
      INSIGHT_LEGAL_WARNING = '(Do not take this as investment advice. Consult your own financial advisor for personal investment counsel.)',
      HELP_RESPONSE_STR     = 'Here is a list of things I\'ll respond to:' + os.EOL +
                              'help --> gets list of commands' + os.EOL +
                              'price --> tells you spot price of BTC to your local currencey (USD if not specified).' + os.EOL +
                              'insight --> tells you current buyer trends';

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
                    MessageHandler.onReceievedMessage(event);
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