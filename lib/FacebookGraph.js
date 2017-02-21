/////////////////////////
// FacebookGraph.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use-strict'

const request = require('request');

//
// Macros
//
const GRAPH_API_URI   = 'https://graph.facebook.com/v2.8/',
      FB_SEND_URI     = 'https://graph.facebook.com/v2.8/me/messages',
      PROFILE_OPTIONS = 'first_name,last_name,profile_pic,locale,timezone,gender';

//
// Contains functions that interact with Facebook Graph and Messenger Platform through the Graph API.
//
function FacebookGraph() {};

//
// Get user profile from Graph.
//
FacebookGraph.prototype.getUserProfilePromise = (userID) => {
    return new Promise((resolve, reject) => {
        let reqBody = {
            uri: (GRAPH_API_URI + userID),
            qs: {
                access_token: process.env.FB_PAGE_ACCESS_TOKEN,
                fields: PROFILE_OPTIONS
            },
            method: 'GET'
        };
        request(reqBody, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                resolve(body);
            }
            else {
                reject(err ? err : Error(JSON.stringify(res, null, '\t')));
            }
        });
    });
};

//
// Send a message using facebook SEND api.
//
FacebookGraph.prototype.sendTextMessagePromise = (recipientId, message) => {
    return new Promise((resolve, reject) => {
        let reqBody = {
            uri: FB_SEND_URI,
            qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: {
                recipient: { id: recipientId },
                message: { text: message }
            }
        };
        request(reqBody, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                resolve(body);
            }
            else {
                reject(err ? err : Error(JSON.stringify(res, null, '\t')));
            }
        });
    });
};

module.exports = FacebookGraph;