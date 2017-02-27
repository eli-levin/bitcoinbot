/////////////////////////
// BitcoinGuru.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

const request = require('request');

//
// Macros
//
const CB_CREDS         = 'public',
      BTC_PAIR         = 'BTC-',
      COINBASE_URI     = 'https://api.coinbase.com/v2/prices/',
      COINBASE_BEARER  = 'abd90df5f27a7b170cd775abf89d632b350b7c1c9d53e08b340cd9832ce52c2c',
      DEFAULT_CURRENCY = 'USD',
      TIME_RANGE       = {
        day:   (d) => { d.setDate(d.getDate() - 1); return d; },
        week:  (d) => { d.setDate(d.getDate() - 7); return d; },
        month: (d) => { d.setMonth(d.getMonth() - 1); return d; },
        year:  (d) => { d.setFullYear(d.getFullYear() - 1); return d; },
      };

//
// Provides knowledge of bitcoin info and trends. 
//
function BitcoinGuru(){};

//
// Get spot price of bitcoin with specified currency (USD if not specified).
// TODO: make this good for bitcoin, etherium, etc. and other currencies.
// TODO: use authentication...
//
BitcoinGuru.prototype.getPrice = (userId, currency, time) => {
    return new Promise((resolve, reject) => {
        let options = {
            uri: COINBASE_URI + BTC_PAIR + (currency ? currency : DEFAULT_CURRENCY) + '/spot',
            headers: { 'auth': {'Bearer': COINBASE_BEARER} },
            method: 'GET'
        };
        
        if (time) { options['qs'] = {date: time}; }
        request(options, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                resolve(body);
            }
            else{
                reject(err ? err : Error(JSON.stringify(res, null, '\t')));
            }
        });
    });
};

//
// Returns promise with past price and current price.
//
BitcoinGuru.prototype.getTimeRangePrices = (mutateDate, userId, currency) => {
    let d = new Date();
    let today = d.toISOString();
    let previousDate = mutateDate(d).toISOString();

    let p1 = this.getPrice(userId, currency, previousDate);
    let p2 = this.getPrice(userId, currency, today);
    return Promise.all([p1, p2]);
};


//
// Get trend signal [past 24 hours].
//
BitcoinGuru.prototype.getDailyTrendSignal = (userId, currency) => {
    return this.getTimeRangePricesPromise(TIME_RANGE.day, userId, currency);
};

//
// Get trend signal [past 7 days].
//
BitcoinGuru.prototype.getWeeklyTrendSignal = (userId, currency) => {
    return this.getTimeRangePricesPromise(TIME_RANGE.week, userId, currency);
};

//
// Get trend signal [past 30 days].
//
BitcoinGuru.prototype.getMonthlyTrendSignal = (userId, currency) => {
    return this.getTimeRangePricesPromise(TIME_RANGE.month, userId, currency);
};

//
// Get trend signal [past 12 months].
//
BitcoinGuru.prototype.getYearlyTrendSignal = (userId, currency) => {
    return this.getTimeRangePricesPromise(TIME_RANGE.year, userId, currency);
};

module.exports = BitcoinGuru;