/////////////////////////
// MessageHandler.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

const os             = require('os'),
      Intent         = require('./Intent.js'),
      BitcoinGuru    = require('../BitcoinGuru.js'),
      FacebookGraph  = require('../FacebookGraph.js'),
      DefaultDialog  = require('../../constants/DefaultDialog.js');

//
// Static handler class for server brains.
//
function MessageHandler() {};


//
// Handler functions
//
MessageHandler.prototype.formulateInsightMessage = (userProfile) => {
    // Procedural function to extract info and create an insight message.
    let msg = DefaultDialog.ERROR_RESPONSE_STR;
    if (userProfile) {
        // placeholder for better insight algorithm
        // check if market is in rally or dive and tell user if btcbot is buying more bitcoin
        msg = `${userProfile["first_name"]}, the current trends show a market rally. People are buying!` +
              os.EOL + '.' + os.EOL + '.' + os.EOL + '.' + os.EOL + DefaultDialog.INSIGHT_LEGAL_WARNING;
    }
    return msg;
};

//
// Response when user calls for help.
//
MessageHandler.prototype.sendHelpMessage = (userID) => {
    let fb = new FacebookGraph();
    fb.sendTextMessage(userID, DefaultDialog.CAPABILITIES_STR)
        .then(body => {
            // todo : DO NOT LOG THIS IN TESTS
            console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
        })
        .catch(err => {console.error(err)});
};

//
// Response when user greets BitcoinBot.
//
MessageHandler.prototype.sendGreeting = (userID) => {
    fb.getUserProfile(userID)
        .then(body => {
            let userProfile = JSON.parse(body);
            let msg = `Hi, ${userProfile.first_name}!`;
            return fb.sendTextMessage(userID, msg);
        })
        .then(body => {
            // todo : DO NOT LOG THIS IN TESTS
            console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
        })
        .catch(err => {console.error(err)});
};

//
// Respond to price inquiry.
//
MessageHandler.prototype.sendPrice = (userID) => {
    // todo: different currencies based on fb user profile info
    guru.getPrice(userID/*, currency, time?*/)
        .then(priceString => {
            return fb.sendTextMessage(userID, '1 BTC = $' + JSON.parse(priceString).data.amount);
        })
        .then(body => {
            // todo : DO NOT LOG THIS IN TESTS
            console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
        })
        .catch(err => {console.error(err)});
};


//
// Respond to insight request.
//
MessageHandler.prototype.sendInsight = (userID) => {};

// THIS WILL BE IN BITCOINBRAINS
// Match an intent to the correction response handler.
//
MessageHandler.prototype.matchIntentToResponse = (intent) => {};

//
//
//
MessageHandler.prototype.onMessageReceived = (userID, cb) => {};

//
// Crude parsing brains.
//
MessageHandler.prototype.parseMessagingEvent = (event) => {
    // Callback fork for message events webhook.
    // TODO: make this a full command line interface with minimist
    let userID = event.sender.id;
    let messageText = event.message.text.trim().toLowerCase();
    let messageAttachments = event.message.attachments;
    let fb = new FacebookGraph();
    let guru = new BitcoinGuru();
    switch (messageText) {
        // todo: add easter eggs lulz
        case 'help':
            fb.sendTextMessage(userID, DefaultDialog.CAPABILITIES_STR)
                .then(body => {
                    // todo : DO NOT LOG THIS IN TESTS
                    console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
                })
                .catch(err => {console.error(err)});
            break;
        case 'yo':
        case 'hi':
        case 'hey':
        case 'hello':
        case 'sup':
            fb.getUserProfile(userID)
                .then(body => {
                    let userProfile = JSON.parse(body);
                    let msg = `Hi, ${userProfile.first_name}!`;
                    return fb.sendTextMessage(userID, msg);
                })
                .then(body => {
                    // todo : DO NOT LOG THIS IN TESTS
                    console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
                })
                .catch(err => {console.error(err)});
            break;
        case 'price':
            // todo: different currencies based on fb user profile info
            guru.getPrice(userID/*, currency, time?*/)
                .then(priceString => {
                    return fb.sendTextMessage(userID, '1 BTC = $' + JSON.parse(priceString).data.amount);
                })
                .then(body => {
                    // todo : DO NOT LOG THIS IN TESTS
                    console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
                })
                .catch(err => {console.error(err)});
            break;
        case 'insight':
            // todo: include graph of btc to usd (would require new function)
            fb.getUserProfile(userID)
                .then(body => {
                    let userProfile = JSON.parse(body);
                    console.log('Success, recieved user information:', userProfile);
                    return fb.sendTextMessage(userID,  this.formulateInsightMessage(userProfile));
                })
                .then(body => {
                    // todo : DO NOT LOG THIS IN TESTS
                    console.log('Success: Sent message %s to recipient %s.', body.message_id, body.recipient_id);
                })
                .catch(err => {console.error(err)});
            break;
        default:
            fb.sendTextMessage(userID, DefaultDialog.DEFAULT_RESPONSE_STR);
    }
};


//
// MessageHandler is singleton.
//
// TODO: should make this not singleton for async?
//
module.exports = MessageHandler;