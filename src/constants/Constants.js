'use strict'

const GRAPH_BASE_URI    = 'https://graph.facebook.com/v2.8/';
const FB_SEND_URI       = 'https://graph.facebook.com/v2.8/me/messages';
const PROFILE_OPTIONS   = 'first_name,last_name,profile_pic,locale,timezone,gender';
const CB_CREDS          = 'public';
const BTC_PAIR          = 'BTC-';
const COINBASE_URI      = 'https://api.coinbase.com/v2/prices/';
const COINBASE_BEARER   = 'abd90df5f27a7b170cd775abf89d632b350b7c1c9d53e08b340cd9832ce52c2c';
const DEFAULT_CURRENCY  = 'USD';

module.exports = {
    GRAPH_BASE_URI: GRAPH_BASE_URI,
    FB_SEND_URI: FB_SEND_URI,
    PROFILE_OPTIONS: PROFILE_OPTIONS,
    CB_CREDS: CB_CREDS,
    BTC_PAIR: BTC_PAIR,
    COINBASE_URI: COINBASE_URI,
    COINBASE_BEARER: COINBASE_BEARER,
    DEFAULT_CURRENCY: DEFAULT_CURRENCY
};