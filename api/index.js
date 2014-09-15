'use strict';

var path      = require('path'),
    express   = require('express'),
    app       = express(),
    routes    = require(path.join(__dirname, 'routes'));

/* ====================================================== */

// SoundCloud redirect URI endpoint
app.get('/sc_redirect', routes.soundcloudRedirect);

/* ====================================================== */

// one search endpoint
app.get('/search/:query', routes.search);

/* ====================================================== */

// mp3 streaming endpoints
app.get('/stream/youtube/:videoId', routes.streaming.youtube);
app.get('/stream/soundcloud/:songId', routes.streaming.soundcloud);
app.get('/stream/spotify/:songId', routes.streaming.spotify);
app.get('/stream/bandcamp/:songUrl', routes.streaming.bandcamp);

/* ====================================================== */

module.exports = app;