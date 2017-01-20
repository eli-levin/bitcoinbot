'use strict'

const assert = require('assert'),
      btcbot = require('../index.js');

describe('app', () => {
    describe('#getUserProfile()', () => {
        it('should fetch the test user\'s fb profile info from fb API', () => {
            btcbot.getUserProfile(process.env.TEST_USER_ID, (err, res, body) => {
                console.log(JSON.stringify(body));
                assert(!err, 'Expected no error in response: ' + JSON.stringify(err));
                assert(body, 'Expected body object. Body = ' + JSON.stringify(body));
                assert(body.hasOwnProperty(first_name), 'Expected body object with property first_name. Body = ' + JSON.stringify(body));
                assert(body.hasOwnProperty(last_name), 'Expected body object with property last_name. Body = ' + JSON.stringify(body));
                assert(body.hasOwnProperty(profile_pic), 'Expected body object with property profile_pic. Body = ' + JSON.stringify(body));
                assert(body.hasOwnProperty(locale), 'Expected body object with property locale. Body = ' + JSON.stringify(body));
                assert(body.hasOwnProperty(timezone), 'Expected body object with property timezone. Body = ' + JSON.stringify(body));
                assert(body.hasOwnProperty(gender), 'Expected body object with property gender. Body = ' + JSON.stringify(body));
            });
        });
    });
});