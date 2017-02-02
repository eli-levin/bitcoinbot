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
const ERROR_RESPONSE_STR = 'Oops, something went wrong. Try again later...',
      CB_CREDS           = 'public';

//
// Provides knowledge of bitcoin info and trends. 
//
function BitcoinGuru(){
    return this;
}

BitcoinGuru.prototype.getPrice = (currencey, cb) => {
    client = new Client({apiKey: CB_CREDS, apiSecret: CB_CREDS});
    client.getSpotPrice({'currenceyPair': BTC_PAIR + currencey}, cb);
};

module.exports = BitcoinGuru;