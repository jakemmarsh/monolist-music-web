'use strict';

var path    = require('path');
var express = require('express');
var api     = express();
var routes  = require(path.join(__dirname, 'routes'));

/* ====================================================== */

/*
 * Playlist Endpoints
 */
api.get('/playlist/:id', routes.playlist.get);
api.put('/playlist', routes.playlist.create);

/* ====================================================== */

// SoundCloud redirect URI endpoint
api.get('/sc_redirect', routes.soundcloudRedirect);

/* ====================================================== */

// one search endpoint
api.get('/search/:query', routes.search);

/* ====================================================== */

// mp3 streaming endpoints
api.get('/stream/youtube/:videoId', routes.streaming.youtube);
api.get('/stream/soundcloud/:songId', routes.streaming.soundcloud);
api.get('/stream/spotify/:songId', routes.streaming.spotify);
api.get('/stream/bandcamp/:songUrl', routes.streaming.bandcamp);

/* ====================================================== */

module.exports = api;