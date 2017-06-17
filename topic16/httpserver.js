var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

// Configuration
var rootDir = __dirname;

var mimeTypes =  { ".html" : "text/html;charset=utf-8",
					".txt"	: "text/plain;charset=utf-8",
					".json" : "application/json;charset=utf-8",
					".jpeg" : "image/jpeg",
					".png"  : "image/png"
			 };

var routes = { '/' : { get: indexHTML, post: null },
				'/load_data': {get:load_data, post:load_data}};

// End of Configuration

function indexHTML(req, res) {
	var path = url.parse(req.url, true);
	var name = path.query.name;
	fs.readFile('index.html', 'utf8', function(err, data) {
		res.writeHead(200, { "Content-Type" : "text/html;charset=utf-8" });
		if (!err) {
			res.write(data);
		} else {
			res.write('Data file not found');
		}
		res.end();
	});
}

function load_data(req,res){
	var path = url.parse(req.url, true);
	console.dir(path.query);
	console.dir(req.url);
	res.writeHead(200, { "Content-Type" : "text/html;charset=utf-8"});
	res.write('Validation is ok! <br>');
	res.write('Surname Name : ' + path.query.uname + '<br>');
  res.write('Email : ' + path.query.email + '<br>');
	res.write('Birthday Date : ' + path.query.bdate + '<br>');
	res.write('Phone : ' + path.query.phone + '<br>');
	res.end();
}


http.createServer(function(req, res){

	var path = url.parse(req.url).pathname;
	if (routes[path] !== undefined) {
		if (routes[path][req.method.toLowerCase()] != null)
			routes[path][req.method.toLowerCase()](req, res);
	} else {
		var filename = url.parse(req.url).pathname;
		var contentType = "text/plain;charset=utf-8";
		var dotPos = filename.lastIndexOf('.');
		if (dotPos != -1) {
			var ext = filename.slice(dotPos).toLowerCase();
			if ( mimeTypes[ext] !== undefined )
				contentType = mimeTypes[ext];
		}
		filename = rootDir + filename;
		fs.readFile(filename, function(err, data) {
			if (!err) {
				res.writeHead(200, { "Content-Type" : contentType });
				res.write(data);
			} else {
				res.writeHead(404, { "Content-Type" : "text/html;charset=utf-8" });
				res.write('File not found');
			}
			res.end();
		});
	}
}).listen(8080);

console.log('Listening on 8080...');
