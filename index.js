'use strict'

const express        = require('express'),
      request        = require('request'),
      bodyParser     = require('body-parser'),
      CoinbaseClient = require('coinbase').Client,
      app            = express();

//
// Macros
//
const CB_CREDS             = 'public';
const FB_SEND_URI          = 'https://graph.facebook.com/v2.6/me/messages';
const FB_GENERIC_API_URI   = 'https://graph.facebook.com/v2.6/';
const ERROR_RESPONSE_STR   = 'Oops, something went wrong. Try again later...';
const DEFAULT_RESPONSE_STR = 'Sorry, I don\'t know what that means. Say "help" for more info!';
const USER_PROFILE_OPTIONS = 'first_name,last_name,profile_pic,locale,timezone,gender';
const HELP_RESPONSE_STR    = 'Here is a list of things I\'ll respond to:\n' +
                             'help --> gets list of commands\n' +
                             'price --> tells you BTC to USD exchange rate';

//
// Init port in app table and process the url and json parsers
//
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//
// Handler functions
//
const formulateAdviceMessage = (userProfile) => {
    // Procedural function to extract info and create an advice message.
    let msg = ERROR_RESPONSE_STR;
    if (userProfile) {
        // placeholder for better advice algorithm
        msg = `${userProfile["first_name"]}, the current trends show a market rally. Buy, buy, buy NOW!`;
    }
    return msg;
};

const getUserProfile = (userID, cb) => {
    // Formulate a personalized advice message for the user descibed by userID.
    let reqBody = {
        uri: (FB_GENERIC_API_URI + userID),
        qs: {
            access_token: process.env.FB_PAGE_ACCESS_TOKEN,
            fields: USER_PROFILE_OPTIONS
        },
        method: 'GET'
    };

    // Send the advice to the user via the callback cb.
    request(reqBody, cb);
};

const fbSendAPI = (messageData) => {
    // Send a request to the faceboook SEND api.
    let reqBody = {
        uri: FB_SEND_URI,
        qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
    };

    request(reqBody, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
        }
        else {
            console.error('Unable to send message.');
            console.error(res);
            console.error(err);
        }
    });
};

const sendTextMessage = (recipientId, msg) => {
    // Send message via send api.
    // TODO: find a way to put callback in params for testing purposes (stubs) without making everything a fucking tornado.
    let messageData = {
        recipient: { id: recipientId },
        message: { text: msg }
    };
    fbSendAPI(messageData);
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
            sendTextMessage(userID, HELP_RESPONSE_STR);
            break;
        case 'price':
            // todo: price -c usd|euro|etc (different currencies)
            // todo: is this dumb in v8? research if singleton client is better
            let client = new CoinbaseClient({'apiKey': userID, 'apiSecret' : CB_CREDS});
            let msg = ERROR_RESPONSE_STR;
            client.getExchangeRates({'currency': 'BTC'}, (err, res) => {
                if (err) {
                    console.error('Unable to get data from Coinbase API.');
                    console.error(res);
                    console.error(err);
                }
                else {
                    //will change to check myCurrency and then do rates[myCurrency]
                    msg = '1 BTC = $' + res.data.rates.USD;
                }
                sendTextMessage(userID, msg);
            });
            break;
        case 'adviseme':
            // todo: include graph of btc to usd (would require new function)
            getUserProfile(userID, (err, res, body) => {
                let userProfile = JSON.parse(body);
                let msg = ERROR_RESPONSE_STR;
                if (!err && res.statusCode == 200) {
                    console.log('Success, recieved user information:', userProfile);
                    // placeholder for better advice algorithm
                    msg = formulateAdviceMessage(userProfile);
                }
                else {
                    console.log('Unable to get user profile.');
                    console.log(res);
                    console.log(err);
                }
                sendTextMessage(userID, msg);
            });
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
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'btcfbbot93d17fe1') {
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
// todo: change this to not shit
module.exports = {
    getUserProfile: getUserProfile,
    formulateAdviceMessage: formulateAdviceMessage
};