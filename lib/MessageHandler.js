/////////////////////////
// MessageHandler.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

const os             = require('os'),
      BitcoinGuru    = require('./BitcoinGuru.js'),
      FacebookGraph  = require('./FacebookGraph.js');


//
// Macros
//
const ERROR_RESPONSE_STR    = 'Oops, something went wrong. Try again later...',
      DEFAULT_RESPONSE_STR  = 'Sorry, I don\'t know what that means. Say "help" for more info!',
      USER_PROFILE_OPTIONS  = 'first_name,last_name,profile_pic,locale,timezone,gender',
      INSIGHT_LEGAL_WARNING = '(Do not take this as investment advice. Consult your own financial advisor for personal investment counsel.)',
      HELP_RESPONSE_STR     = 'Here is a list of things I\'ll respond to:' + os.EOL +
                              'help --> gets list of commands' + os.EOL +
                              'price --> tells you spot price of BTC to your local currencey (USD if not specified).' + os.EOL +
                              'insight --> tells you current buyer trends';

//
// Static handler class for server brains.
//
function MessageHandler() {};


//
// Handler functions
//
MessageHandler.prototype.formulateInsightMessage = (userProfile) => {
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

//
//
//
MessageHandler.prototype.sendHelpMessage = () => {};

//
// Crude parsing brains.
//
MessageHandler.prototype.onReceievedMessage = (event) => {
    // Callback fork for message events webhook.
    // TODO: make this a full command line interface with minimist
    let userID = event.sender.id;
    let messageText = event.message.text.trim().toLowerCase();
    let messageAttachments = event.message.attachments;
    let fb = FacebookGraph();
    let guru = BitcoinGuru();
    switch (messageText) {
        // todo: add easter eggs lulz
        case 'help':
            fb.sendTextMessagePromise(userID, HELP_RESPONSE_STR)
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
            guru.getPricePromise(userID/*, currency, time?*/)
                .then(priceString => {
                    return fb.sendTextMessagePromise(userID, '1 BTC = $' + JSON.parse(priceString).data.amount);
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
                    return fb.sendTextMessagePromise(userID, this.formulateInsightMessage(userProfile));
                })
                .then(body => {
                    console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
                })
                .catch(err => {console.error(err)});
            break;
        default:
            fb.sendTextMessage(userID, DEFAULT_RESPONSE_STR);
    }
};


//
// MessageHandler is singleton.
//
// TODO: should make this not singleton for async?
//
module.exports = () => {
    return new MessageHandler();
};