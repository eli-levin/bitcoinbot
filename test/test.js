'use strict'

const assert = require('assert'),
      btcbot = require('../index.js');

describe('app', () => {
    describe('#getUserProfile()', () => {
        it('Should fetch the test user\'s fb profile info from fb API.', (done) => {
            btcbot.getUserProfile(process.env.TEST_USER_ID, (err, res, body) => {
                let userProfile = JSON.parse(body);
                assert.equal(res.statusCode, 200, 'Expected successful status code in response ' + JSON.stringify(res, null, '\t'));
                assert(!err, 'Expected no error in response ' + JSON.stringify(err, null, '\t'));
                assert(userProfile, 'Expected body object. Body = ' + JSON.stringify(res, null, '\t'));
                assert(userProfile.hasOwnProperty("first_name"), 'Expected body object with property first_name. Body = ' + JSON.stringify(res, null, '\t'));
                assert(userProfile.hasOwnProperty("last_name"), 'Expected body object with property last_name. Body = ' + JSON.stringify(res, null, '\t'));
                assert(userProfile.hasOwnProperty("profile_pic"), 'Expected body object with property profile_pic. Body = ' + JSON.stringify(res, null, '\t'));
                assert(userProfile.hasOwnProperty("locale"), 'Expected body object with property locale. Body = ' + JSON.stringify(res, null, '\t'));
                assert(userProfile.hasOwnProperty("timezone"), 'Expected body object with property timezone. Body = ' + JSON.stringify(res, null, '\t'));
                assert(userProfile.hasOwnProperty("gender"), 'Expected body object with property gender. Body = ' + JSON.stringify(res, null, '\t'));
                done();
            });
        });
    });
});