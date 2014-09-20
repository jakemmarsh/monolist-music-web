'use strict';

var path    = require('path');
var express = require('express');
var api     = express();
var routes  = require(path.join(__dirname, 'routes'));

/* ====================================================== */

/*
 * User Endpoints
 */
 api.get('/users/:username', routes.user.get);

/* ====================================================== */

/*
 * Playlist Endpoints
 */
api.get('/playlists/:id', routes.playlist.get);
api.put('/playlists', routes.playlist.create);

/* ====================================================== */

// SoundCloud redirect URI endpoint
api.get('/sc_redirect', routes.soundcloudRedirect);

/* ====================================================== */

// one search endpoint
api.get('/search/:query', routes.search);

/* ====================================================== */

// mp3 streaming endpoints
api.get('/stream/youtube/:videoId', routes.streaming.youtube);
api.get('/stream/soundcloud/:trackId', routes.streaming.soundcloud);
api.get('/stream/spotify/:trackId', routes.streaming.spotify);
api.get('/stream/bandcamp/:trackUrl', routes.streaming.bandcamp);

/* ====================================================== */

module.exports = api;