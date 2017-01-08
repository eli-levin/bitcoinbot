'use strict'

const express = require('express'),
	bodyParser = require('body-parser'),
	request = require('request');

const app = express();

// init port in app table and process the url and json parsers
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('bitcoin messages go here...');
});

app.get('/webhook', (req, res) => {
	if (req.query['hub.verify_token'] === 'btcfbbot93d17fe1'){
    	res.send(req.query['hub.challenge']);
    }
    else{
    	res.send('Error, wrong validation token');    
    }
});

app.listen(app.get('port'), () => {
	console.log(`listening at http:\/\/localhost:${app.get('port')}`);
});