/////////////////////////
// Bitcoin Guru Test
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

const assert      = require('assert'),
      BitcoinGuru = require('../src/services/BitcoinGuru.js'),
      os          = require('os');

//
// Init guru
//
let guru = new BitcoinGuru();

//
// Test BitcoinGuru
//
describe('BitcoinGuru', () => {
    describe('#getPrice(arg1, arg2)', () => {
        it('Should fetch the current spot price of bitcoin.', (done) => {
            //-- Begin test call
            guru.getPrice('poop'/*todo: change this to the test user id*/, 'USD')
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