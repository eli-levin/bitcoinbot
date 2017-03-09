/////////////////////////
// Message Handler Test
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

const assert         = require('assert'),
      MessageHandler = require('../src/services/ai/MessageHandler.js'),
      t_userProfile  = require('./data/userProfile.js').t_userProfile,
      t_messageEvent = require('./data/messageEvent.js').t_messageEvent,
      os             = require('os');

//
// Initialize handler
//
const handler = new MessageHandler();

//
// Test MessageHandler
//
describe('MessageHandler', () => {
    describe('#formulateInsightMessage()', () => {
        it('Should create an insight message with a crude analysis of current trends.', () => {
            const msg = handler.formulateInsightMessage(t_userProfile);
            assert(msg);
        });
    });

    describe('#onReceievedMessage()', () => {
        it('Should ...'/*todo: make this function not shit*/, () => {
            // todo: implement tests
        });
    });
});
