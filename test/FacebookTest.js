/////////////////////////
// Facebook Service Test
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

const assert         = require('assert'),
      FacebookGraph  = require('../src/services/FacebookGraph.js'),
      os             = require('os');

//
// Init service
//
let fb = new FacebookGraph();

//
// Test FacebookGraph
//
describe('FacebookGraph', () => {
    describe('#getUserProfile()', () => {
        it('Should fetch the test user\'s facebook profile.', () => {
            //-- Begin test call
            return fb.getUserProfile(process.env.TEST_USER_ID)
                .then(body => {
                    let userProfile = JSON.parse(body);
                    assert(userProfile, 'Expected body object. Body = ' + body);
                    assert(userProfile.hasOwnProperty('first_name'), 'Expected body object with property first_name. Body = ' + body);
                    assert(userProfile.hasOwnProperty('last_name'), 'Expected body object with property last_name. Body = ' + body);
                    assert(userProfile.hasOwnProperty('profile_pic'), 'Expected body object with property profile_pic. Body = ' + body);
                    assert(userProfile.hasOwnProperty('locale'), 'Expected body object with property locale. Body = ' + body);
                    assert(userProfile.hasOwnProperty('timezone'), 'Expected body object with property timezone. Body = ' + body);
                    assert(userProfile.hasOwnProperty('gender'), 'Expected body object with property gender. Body = ' + body);
                });
            //-- End test call
        });
    });

    describe('#sendTextMessage()', () => {
        it('Should send a text message to the test user.', () => {
            //-- Begin test call
            return fb.sendTextMessage(process.env.TEST_USER_ID, "Message sent from test on " + os.EOL + new Date().toString())
                .then(body => {
                    assert(body.hasOwnProperty('recipient_id'), 'Response should have field recipient_id' + JSON.stringify(body, null, '\t'));
                    assert(body.hasOwnProperty('message_id'), 'Response should have field message_id' + JSON.stringify(body, null, '\t'));
                });
            //-- End test call
        });
    });
});