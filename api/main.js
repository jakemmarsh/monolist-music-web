'use strict';

var path      = require('path'),
    express   = require('express'),
    app       = express(),
    routes    = require(path.join(__dirname, 'routes'));

/* ====================================================== */

// one search endpoint
app.get('/search/:query', routes.search);

/* ====================================================== */

// mp3 streaming endpoints
app.get('/youtube/:videoId', routes.streaming.youtube);
app.get('/soundcloud/:songId', routes.streaming.soundcloud);
app.get('/spotify/:songId', routes.streaming.spotify);
app.get('/bandcamp/:songUrl', routes.streaming.bandcamp);

/* ====================================================== */

module.exports = app;