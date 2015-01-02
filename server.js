'use strict';

var express        = require('express');
var morgan         = require('morgan');
var compression    = require('compression');
var methodOverride = require('method-override');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var server         = express();

/* ====================================================== */

server.use(morgan('dev'));     // Logs all requests to the console
server.use(compression());     // Compresses response data with gzip/deflate
server.use(methodOverride());  // Simulates DELETE and PUT
server.use(bodyParser.json()); // Parses req.body json from html POST
server.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded req.body, including extended syntax
server.use(cookieParser());
server.set('json spaces', 0);  // Remove superfluous spaces from JSON responses

/* ====================================================== */

// Add headers
server.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

/* ====================================================== */

// serve all asset files from necessary directories
// TODO: find a way to get rid of these wildcards?
server.use('*/js', express.static(__dirname + '/build/js'));
server.use('*/images', express.static(__dirname + '/build/images'));
server.use('*/css', express.static(__dirname + '/build/css'));
server.use('*/fonts', express.static(__dirname + '/build/fonts'));

/* ====================================================== */

// Serve index.html for all main routes to leave routing up to react-router
server.all('/*', function(req, res) {
    res.sendFile('index.html', { root: 'build' });
});

/* ====================================================== */

// start the server
server.listen(process.env.PORT || 3000);