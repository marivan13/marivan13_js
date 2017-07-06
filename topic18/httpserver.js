var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var express = require('express');
var app = express();

var mimeTypes =  { ".html" : "text/html;charset=utf-8",
					".txt"	: "text/plain;charset=utf-8",
					".json" : "application/json;charset=utf-8",
					".jpeg" : "image/jpeg",
					".png"  : "image/png"
			 };


// End of Configuration

app.use(express.static(__dirname));


app.get('/', function (req, res) {
	res.sendFile(__dirname + '/payment_first_stage.html');
});

app.get('/second_stage', function(req, res){
	res.sendFile(__dirname + '/payment_second_stage.html');
});

app.get('/fill_images', function(req, res){
	fs.readFile('data/payment_system.json', function(err, data) {
		var payment_system = JSON.parse(data);
		res.json(payment_system);
	});
});

app.get('/fill_mobile_operator', function(req, res){
	fs.readFile('data/mobile_operator.json', function(err, data) {
		var mobile_operator = JSON.parse(data);
		res.json(mobile_operator);
	});
});

app.get('/fill_exp_month', function(req, res){
	fs.readFile('data/exp_month.json', function(err, data) {
		var exp_month = JSON.parse(data);
		res.json(exp_month);
	});
});

app.get('/fill_exp_year', function(req, res){
	fs.readFile('data/exp_year.json', function(err, data) {
		var exp_year = JSON.parse(data);
		res.json(exp_year);
	});
});

app.get('/payment', function(req, res){
	//do smth with payment data and response
		console.log(req.query.payment_data);
		var payment_data = JSON.stringify(req.query.payment_data);
		res.send(payment_data);
});


app.listen(8080, function () {
	console.log('Listening on 8080...')
});
