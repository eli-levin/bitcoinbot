/////////////////////////
// BitcoinGuru.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

const Client = require('coinbase').Client;

//
// Macros
//
const CB_CREDS = 'public',
      BTC_PAIR = 'BTC-',
      DEFAULT_CURRENCEY = 'USD';

//
// Provides knowledge of bitcoin info and trends. 
//
function BitcoinGuru() {};

//
// Get spot price of bitcoin with specified currencey (USD if not specified).
//
BitcoinGuru.prototype.getPrice = (currencey, cb) => {
    let client = new Client({apiKey: CB_CREDS, apiSecret: CB_CREDS});
    client.getSpotPrice({ 'currenceyPair': BTC_PAIR + (currencey ? currencey : DEFAULT_CURRENCEY) }, cb);
};

//
// Get trend signal for specified time range.
//
BitcoinGuru.prototype.getTrendSignal = void 0;

module.exports = BitcoinGuru;