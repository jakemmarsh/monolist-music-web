'use strict';

var path                = require('path');
var express             = require('express');
var morgan              = require('morgan');
var compression         = require('compression');
var methodOverride      = require('method-override');
var bodyParser          = require('body-parser');
var orm                 = require('orm');
var app                 = express();
var apiApp              = require(path.join(__dirname, 'api'));
var config              = require(path.join(__dirname, 'config'));
var dbConnectionOptions = {
  protocol: 'postgres',
  database: config.database.name,
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password
};

/* ====================================================== */

app.use(morgan('dev'));     // Logs all requests to the console
app.use(compression());     // Compresses response data with gzip/deflate
app.use(methodOverride());  // Simulates DELETE and PUT
app.use(bodyParser.json()); // Parses req.body json from html POST
app.use(bodyParser.urlencoded({
    extended: true
}));                        // Parses urlencoded req.body, including extended syntax
app.set('json spaces', 0);  // Remove superfluous spaces from JSON responses

/* ====================================================== */

// Connect to database and initialize models
app.use(orm.express(dbConnectionOptions, {
  define: function (db, models, next) {
    var apiModels = require(path.join(__dirname, 'api/models'))(db);

    models.user = apiModels.user;
    models.comment = apiModels.comment;
    models.track = apiModels.track;
    models.playlist = apiModels.playlist;

    models.user.sync();
    models.comment.sync();
    models.track.sync();
    models.playlist.sync();

    next();
  }
}));

/* ====================================================== */

// Add headers
app.use(function (req, res, next) {
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

// Serve all asset files from build directory
app.use(express.static('./build'));

// Mount the API
app.use('/api', apiApp);

// Serve index.html for all main routes to leave routing up to Angular
app.all('/*', function(req, res) {
    res.sendFile('index.html', { root: 'build' });
});

/* ====================================================== */

// start the server
app.listen(process.env.PORT || 3000);