/////////////////////////
// test.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

const assert        = require('assert'),
      //btcbot        = require('../app.js'),
      BitcoinGuru   = require('../lib/BitcoinGuru.js'),
      FacebookGraph = require('../lib/FacebookGraph.js'),
      os            = require('os');

//
// Stuff
//
let fb   = new FacebookGraph();
let guru = new BitcoinGuru();

//
// Test app
//
// describe('app', () => {
//     describe('#getUserProfile()', () => {
//         it('Should fetch the test user\'s fb profile info from fb API.', (done) => {
//             btcbot.getUserProfile(process.env.TEST_USER_ID, (err, res, body) => {
//                 let userProfile = JSON.parse(body);
//                 assert.equal(res.statusCode, 200, 'Expected successful status code in response ' + JSON.stringify(res, null, '\t'));
//                 assert(!err, 'Expected no error in response ' + JSON.stringify(err, null, '\t'));
//                 assert(userProfile, 'Expected body object. Body = ' + JSON.stringify(res, null, '\t'));
//                 assert(userProfile.hasOwnProperty("first_name"), 'Expected body object with property first_name. Body = ' + JSON.stringify(res, null, '\t'));
//                 assert(userProfile.hasOwnProperty("last_name"), 'Expected body object with property last_name. Body = ' + JSON.stringify(res, null, '\t'));
//                 assert(userProfile.hasOwnProperty("profile_pic"), 'Expected body object with property profile_pic. Body = ' + JSON.stringify(res, null, '\t'));
//                 assert(userProfile.hasOwnProperty("locale"), 'Expected body object with property locale. Body = ' + JSON.stringify(res, null, '\t'));
//                 assert(userProfile.hasOwnProperty("timezone"), 'Expected body object with property timezone. Body = ' + JSON.stringify(res, null, '\t'));
//                 assert(userProfile.hasOwnProperty("gender"), 'Expected body object with property gender. Body = ' + JSON.stringify(res, null, '\t'));
//                 done();
//             });
//         });
//     });
// });

//
// Test FacebookGraph
//
describe('FacebookGraph', () => {
    describe('#getUserProfilePromise()', () => {
        it('Should fetch the test user\'s facebook profile.', (done) => {
            //-- Begin test call
            fb.getUserProfilePromise(process.env.TEST_USER_ID)
                .then(body => {
                    let userProfile = JSON.parse(body);
                    assert(userProfile, 'Expected body object. Body = ' + body);
                    assert(userProfile.hasOwnProperty('first_name'), 'Expected body object with property first_name. Body = ' + body);
                    assert(userProfile.hasOwnProperty('last_name'), 'Expected body object with property last_name. Body = ' + body);
                    assert(userProfile.hasOwnProperty('profile_pic'), 'Expected body object with property profile_pic. Body = ' + body);
                    assert(userProfile.hasOwnProperty('locale'), 'Expected body object with property locale. Body = ' + body);
                    assert(userProfile.hasOwnProperty('timezone'), 'Expected body object with property timezone. Body = ' + body);
                    assert(userProfile.hasOwnProperty('gender'), 'Expected body object with property gender. Body = ' + body);
                    done();
                })
                .catch(err => done(err));
            //-- End test call
        });
    });

    describe('#sendTextMessagePromise()', () => {
        it('Should send a text message to the test user.', (done) => {
            //-- Begin test call
            fb.sendTextMessagePromise(process.env.TEST_USER_ID, "Message sent from test on ." + os.EOL + new Date().toString())
                .then(body => {
                    assert(body.hasOwnProperty('recipient_id'), 'Response should have field recipient_id' + JSON.stringify(body, null, '\t'));
                    assert(body.hasOwnProperty('message_id'), 'Response should have field message_id' + JSON.stringify(body, null, '\t'));
                    done();
                })
                .catch(err => done(err));
            //-- End test call
        });
    });
});

//
// Test BitcoinGuru
//
describe('BitcoinGuru', () => {
    describe('#getPricePromise(arg1, arg2)', () => {
        it('Should fetch the current spot price of bitcoin.', (done) => {
            //-- Begin test call
            guru.getPricePromise('poop'/*todo: change this to the test user id*/, 'USD')
                .then(priceString => {
                    let priceObj = JSON.parse(priceString);
                    assert(priceObj, 'Expected a price object in the body of the response.');
                    assert(priceObj.hasOwnProperty('data'), 'Expected priceObj to have a data field.');
                    assert(priceObj.data.hasOwnProperty('amount'), 'Expected price\'s data object to have amount field.');
                    done();
                })
                .catch(err => done(err));
            //-- End test call
        });
    });
});