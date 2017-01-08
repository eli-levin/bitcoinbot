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
	if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === <VERIFY_TOKEN>) {
		console.log("Validating webhook");
		res.status(200).send(req.query['hub.challenge']);
	}
	else{
		console.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);          
	}  
});

app.post('/webhook', (req, res) => {
	let token = process.env.FB_PAGE_ACCESS_TOKEN
});

app.listen(app.get('port'), () => {
	console.log(`listening at http:\/\/localhost:${app.get('port')}`);
});