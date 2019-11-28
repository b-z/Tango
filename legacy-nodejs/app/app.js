var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var path = require('path');

var routes = require('./routes');
var config = require('./config');

var app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

http.createServer(app).listen(config.port, function() {
	console.log(`HTTP server listening on port ${config.port}.`);
});

app.set('view engine', 'ejs');

app.use('/', routes);
