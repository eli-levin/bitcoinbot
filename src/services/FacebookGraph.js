/////////////////////////
// FacebookGraph.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use-strict'

const request   = require('request'),
      Constants = require('../constants/Constants.js');

//
// Contains functions that interact with Facebook Graph and Messenger Platform through the Graph API.
//
function FacebookGraph() {};

//
// Get user profile from Graph.
//
FacebookGraph.prototype.getUserProfile = (userID) => {
    return new Promise((resolve, reject) => {
        let reqBody = {
            uri: (Constants.GRAPH_BASE_URI + userID),
            qs: {
                access_token: process.env.FB_PAGE_ACCESS_TOKEN,
                fields: Constants.PROFILE_OPTIONS
            },
            method: 'GET'
        };
        return request(reqBody, (err, res, body) => {
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
FacebookGraph.prototype.sendTextMessage = (recipientId, message) => {
    return new Promise((resolve, reject) => {
        let reqBody = {
            uri: Constants.FB_SEND_URI,
            qs: { access_token: process.env.FB_PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: {
                recipient: { id: recipientId },
                message: { text: message }
            }
        };
        return request(reqBody, (err, res, body) => {
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