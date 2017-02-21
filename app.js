/////////////////////////
// app.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

const express        = require('express'),
      request        = require('request'),
      bodyParser     = require('body-parser'),
      CoinbaseClient = require('coinbase').Client,
      fb             = require('./lib/FacebookGraph.js'),
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
// Handler functions
//
const formulateInsightMessage = (userProfile) => {
    // Procedural function to extract info and create an insight message.
    let msg = ERROR_RESPONSE_STR;
    if (userProfile) {
        // placeholder for better insight algorithm
        // check if market is in rally or dive and tell user if btcbot is buying more bitcoin
        msg = `${userProfile["first_name"]}, the current trends show a market rally. People are buying!` +
              os.EOL + '.' + os.EOL + '.' + os.EOL + '.' + os.EOL + INSIGHT_LEGAL_WARNING;
    }
    return msg;
};

const onReceievedMessage = (event) => {
    // Callback fork for message events webhook.
    // TODO: make this a full command line interface with minimist
    let userID = event.sender.id;
    let messageText = event.message.text.trim().toLowerCase();
    let messageAttachments = event.message.attachments;
    switch (messageText) {
        // todo: add easter eggs lulz
        case 'help':
            fb.sendTextMessagePromise(userID, HELP_RESPONSE_STR)
                //.then().catch(); <--- TODO: this
                .then(body => {
                    console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
                })
                .catch(err => {console.error(err)});
            break;
        case 'yo':
        case 'hi':
        case 'hey':
        case 'hello':
        case 'sup':
            fb.getUserProfilePromise(userID)
                .then(body => {
                    let userProfile = JSON.parse(body);
                    let msg = `Hi, ${userProfile.first_name}!`;
                    return fb.sendTextMessagePromise(userID, msg);
                })
                .then(body => {
                    console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
                })
                .catch(err => {console.error(err)});
            break;
        case 'price':
            // todo: different currencies based on fb user profile info
            let guru = new BitcoinGuru();
            guru.getPricePromise(userID/*, currency, time?*/)
                .then(priceObj => {
                    return fb.sendTextMessagePromise(userID, '1 BTC = $' + priceObj.data.amount);
                })
                .then(body => {
                    console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
                })
                .catch(err => {console.error(err)});
            break;
        case 'insight':
            // todo: include graph of btc to usd (would require new function)
            fb.getUserProfilePromise(userID)
                .then(body => {
                    let userProfile = JSON.parse(body);
                    console.log('Success, recieved user information:', userProfile);
                    return fb.sendTextMessagePromise(userID, formulateInsightMessage(userProfile));
                })
                .then(body => {
                    console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
                })
                .catch(err => {console.error(err)});
            break;
        default:
            sendTextMessage(userID, DEFAULT_RESPONSE_STR);
    }
};

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
                    onReceievedMessage(event);
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

//
// export functions for testing
//
module.exports = {
    formulateInsightMessage: formulateInsightMessage
};