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
				'/search': {get:search, post:null}};

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

function search(req,res){
	var path = url.parse(req.url, true);
	fs.readFile('corncob_lowercase.txt','utf-8', function(err, data) {
	res.writeHead(200, { "Content-Type" : "text/plain;charset=utf-8" });
		if (err) return console.log(err);

		var search_input = path.query.search_input;
		var search_show_count = parseInt(path.query.search_show_count);
		var search_data = data.toString().replace(/\"/g, "").split(/\n/);
		var search_obj = {"items":[]};
		var search_count = 0;

		for (search_item of search_data) {
				if (search_item.startsWith(search_input)){
					if (search_count < search_show_count){
						search_obj.items.push(search_item);
						search_count++;
					}
				}
			console.log(search_item);
		}
		res.write(JSON.stringify(search_obj));
		res.end();
	});
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
