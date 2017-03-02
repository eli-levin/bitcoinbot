/////////////////////////
// TimeMutators.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use strict'

//
// Time Mutator Functions
//
const past_day   = (d) => { d.setDate(d.getDate() - 1); return d; };
const past_week  = (d) => { d.setDate(d.getDate() - 7); return d; };
const past_month = (d) => { d.setMonth(d.getMonth() - 1); return d; };
const past_year  = (d) => { d.setFullYear(d.getFullYear() - 1); return d; };

module.exports = {
    PAST_DAY: past_day,
    PAST_WEEK: past_week,
    PAST_MONTH: past_month,
    PAST_YEAR: past_year
};