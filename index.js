'use strict'

// macros
const cbCreds = 'public';
const defaultResponseText = 'Sorry, I don\'t know what that means yet. Say "help" for more info!';
const fbSendURI = 'https://graph.facebook.com/v2.6/me/messages';

const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const CoinbaseClient = require('coinbase').Client;
const app = express();

// init port in app table and process the url and json parsers
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* handler functions */

const fbSendAPI = (messageData) => {
    let reqBody = {
        uri: fbSendURI,
        qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData
    };

    let cb = (err, res, body) => {
        if (!err && res.statusCode == 200) {
            console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
        }
        else {
            console.error('Unable to send message.');
            console.error(res);
            console.error(err);
        }
    };

    request(reqBody, cb);
};

const sendTextMessage = (recipientId, msg) => {
    let messageData = {
        recipient: {id: recipientId},
        message: {text: msg}
    };
    fbSendAPI(messageData);
};

const receievedMessage = (event) => {
    // TODO: make this a full command line interface with minimist
    let senderId = event.sender.id;
    let messageText = event.message.text;
    let messageAttachments = event.message.attachments;
    switch (messageText) {
        case 'help':
            //todo: list all the commands
            break;
        case 'price':
            // todo: price -c usd|euro|etc (different currencies)
            // todo: is this dumb in v8? research if singleton client is better
            let client = new CoinbaseClient({'apiKey': senderId, 'apiSecret' : cbCreds});
            client.getExchangeRates({'currency': 'BTC'}, (err, res) => {
                if (err) {
                    console.error('Unable to get data from Coinbase API.');
                    console.error(res);
                    console.error(err);
                    sendTextMessage(senderId, 'Oops, we made a mistake. Try again later...');
                }
                else {
                    //will change to check myCurrency and then do rates[myCurrency]
                    sendTextMessage(senderId, '1 BTC = $' + res.data.rates.USD);
                }
            });
            break;
        case 'adviseme':
            // todo: include graph of btc to usd (would require new function)
            // sendAdviceMessage(senderId);
            // break;
        default:
            sendTextMessage(senderId, defaultResponseText);
    }
};

// webhook event handling
app.get('/', (req, res) => {
    res.send('bitcoin messages go here...');
});

app.get('/webhook', (req, res) => {
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
    let data = req.body;
    if (data.object === 'page') {
        data.entry.forEach((entry) => {
            let pageID = entry.id;
            let timeOfEvent = entry.time;

            // iterate over each messaging event
            entry.messaging.forEach((event) => {
                if (event.message) {
                    receivedMessage(event);
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