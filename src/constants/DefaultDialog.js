'use strict'

// Default messages for specific event requests
const HELP_RESPONSE_STR     = 'Here is a list of things I\'ll respond to:';
const ERROR_RESPONSE_STR    = 'Oops, something went wrong. Try again later...';
const DEFAULT_RESPONSE_STR  = 'Sorry, I don\'t know what that means. Say "help" for more info!';
const INSIGHT_LEGAL_WARNING = '(Do not take this as investment advice. Consult your own financial advisor for personal investment counsel.)';

// Commands descriptions
const HELP    = 'help --> gets list of commands';
const PRICE   = 'price --> gets spot price of BTC to your local currencey (USD if not specified)';
const INSIGHT = 'insight --> offers an analysis of current buying trends';

// Capabilities message for help command
const CAPABILITIES_STR = `${HELP_RESPONSE_STR}\n\n${HELP}\n${PRICE}\n${INSIGHT}`;

module.exports = {
    ERROR_RESPONSE_STR: ERROR_RESPONSE_STR,
    DEFAULT_RESPONSE_STR: DEFAULT_RESPONSE_STR,
    INSIGHT_LEGAL_WARNING: INSIGHT_LEGAL_WARNING,
    CAPABILITIES_STR: CAPABILITIES_STR
};