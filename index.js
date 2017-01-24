'use strict'

const express        = require('express'),
      request        = require('request'),
      bodyParser     = require('body-parser'),
      CoinbaseClient = require('coinbase').Client,
      os             = require('os'),
      app            = express();

//
// Macros
//
const CB_CREDS              = 'public',
      FB_SEND_URI           = 'https://graph.facebook.com/v2.6/me/messages',
      FB_GENERIC_API_URI    = 'https://graph.facebook.com/v2.6/',
      ERROR_RESPONSE_STR    = 'Oops, something went wrong. Try again later...',
      DEFAULT_RESPONSE_STR  = 'Sorry, I don\'t know what that means. Say "help" for more info!',
      USER_PROFILE_OPTIONS  = 'first_name,last_name,profile_pic,locale,timezone,gender',
      INSIGHT_LEGAL_WARNING = '(Do not take this as investment advice. Consult your own financial advisor for personal investment counsel.)',
      HELP_RESPONSE_STR     = 'Here is a list of things I\'ll respond to:' + os.EOL +
                              'help --> gets list of commands' + os.EOL +
                              'price --> tells you BTC to USD exchange rate' + os.EOL +
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
              os.EOL +
              INSIGHT_LEGAL_WARNING;
    }
    return msg;
};

const getUserProfile = (userID, cb) => {
    // Formulate a personalized insight message for the user descibed by userID.
    let reqBody = {
        uri: (FB_GENERIC_API_URI + userID),
        qs: {
            access_token: process.env.FB_PAGE_ACCESS_TOKEN,
            fields: USER_PROFILE_OPTIONS
        },
        method: 'GET'
    };

    // Send the insight to the user via the callback cb.
    request(reqBody, cb);
};

// const getUserProfilePromise = (userID) => {
//     // Get user profile from Graph API.
//     return new Promise((resolve, reject) => {
//         let reqBody = {
//             uri: (FB_GENERIC_API_URI + userID),
//             qs: {
//                 access_token: process.env.FB_PAGE_ACCESS_TOKEN,
//                 fields: USER_PROFILE_OPTIONS
//             },
//             method: 'GET'
//         };
//         request(reqBody, (err, res, body) => {
//             if (!err && res.statusCode == 200) {
//                 resolve(body);
//             }
//             else {
//                 reject(Error(err));
//             }
//         });
//     });

// };

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
            console.error(err);
            console.error(res);
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
        case 'yo':
        case 'hi':
        case 'hey':
        case 'hello':
            getUserProfile(userID, (err, res, body) => {
                let userProfile = JSON.parse(body);
                let msg = 'Hi there!';
                if (!err && res.statusCode == 200) {
                    msg = `Hi, ${userProfile.first_name}!`;
                }
                else {
                    console.error(err);
                    console.error(res);
                }
                sendTextMessage(userID, msg);
            });
            break;
        case 'price':
            // todo: price -c usd|euro|etc (different currencies)
            let client = new CoinbaseClient({'apiKey': userID, 'apiSecret' : CB_CREDS});
            let msg = ERROR_RESPONSE_STR;
            client.getExchangeRates({'currency': 'BTC'}, (err, res) => {
                if (!err) {
                    //will change to check myCurrency and then do rates[myCurrency]
                    msg = '1 BTC = $' + res.data.rates.USD;
                }
                else {
                    console.error('Unable to reach Coinbase API: ', err);
                }
                sendTextMessage(userID, msg);
            });
            break;
        case 'insight':
            // todo: include graph of btc to usd (would require new function)
            getUserProfile(userID, (err, res, body) => {
                let userProfile = JSON.parse(body);
                let msg = ERROR_RESPONSE_STR;
                if (!err && res.statusCode == 200) {
                    console.log('Success, recieved user information:', userProfile);
                    msg = formulateInsightMessage(userProfile);
                }
                else {
                    console.error(err);
                    console.error(res);
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
    formulateInsightMessage: formulateInsightMessage
};