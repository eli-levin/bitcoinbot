/////////////////////////
// BitcoinGuru.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

const request     = require('request'),
      TimeMutator = require('./TimeMutator.js'),
      Constants   = require('../constants/Constants.js');

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
            uri: Constants.COINBASE_URI + Constants.BTC_PAIR + (currency ? currency : Constants.DEFAULT_CURRENCY) + '/spot',
            headers: { 'auth': {'Bearer': Constants.COINBASE_BEARER} },
            method: 'GET'
        };
        
        if (time) { options['qs'] = {date: time}; }
        return request(options, (err, res, body) => {
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
    return this.getTimeRangePricesPromise(TimeMutator.PAST_DAY, userId, currency);
};

//
// Get trend signal [past 7 days].
//
BitcoinGuru.prototype.getWeeklyTrendSignal = (userId, currency) => {
    return this.getTimeRangePricesPromise(TimeMutator.PAST_WEEK, userId, currency);
};

//
// Get trend signal [past 30 days].
//
BitcoinGuru.prototype.getMonthlyTrendSignal = (userId, currency) => {
    return this.getTimeRangePricesPromise(TimeMutator.PAST_MONTH, userId, currency);
};

//
// Get trend signal [past 12 months].
//
BitcoinGuru.prototype.getYearlyTrendSignal = (userId, currency) => {
    return this.getTimeRangePricesPromise(TimeMutator.PAST_YEAR, userId, currency);
};

module.exports = BitcoinGuru;