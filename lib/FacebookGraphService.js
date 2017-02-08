/////////////////////////
// FacebookGraphService.js
// 2017 (c) Eli Levin
// BitcoinBot
/////////////////////////

'use-strict'

const request = require('request');

//
// Macros
//
const GRAPH_API_URI = 'https://graph.facebook.com/v2.6/',
      USER_PROFILE_OPTIONS = 'first_name,last_name,profile_pic,locale,timezone,gender,user_currency';

//
// Service that contains functions to make requests to the Facebook Graph API
//
function FacebookGraphService() {};

//
// Get user profile from Graph API.
//
FacebookGraphService.prototype.getUserProfilePromise = (userID) => {
    return new Promise((resolve, reject) => {
        let reqBody = {
            uri: (GRAPH_API_URI + userID),
            qs: {
                access_token: process.env.FB_PAGE_ACCESS_TOKEN,
                fields: USER_PROFILE_OPTIONS
            },
            method: 'GET'
        };
        request(reqBody, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                resolve(body);
            }
            else {
                reject(Error(err ? err : res));
            }
        });
    });
};