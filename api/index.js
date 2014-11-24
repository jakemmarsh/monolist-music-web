'use strict';

var path           = require('path');
var express        = require('express');
var passport       = require('passport');
var api            = express();
var setupPassport  = require('./passport');
var routes         = require(path.join(__dirname, 'routes'));

/* ====================================================== */

setupPassport();

/* ====================================================== */

// Auth endpoints
api.put('/register', routes.auth.register);
api.get('/check', routes.auth.isAuthenticated, function(req, res) {
  res.status(200).json(req.user);
});
api.post('/login', passport.authenticate('local'), routes.auth.login);
api.post('/logout', routes.auth.isAuthenticated, routes.auth.logout);

/* ====================================================== */

// User endpoints
api.get('/user/:identifier', routes.user.get);
api.get('/user/:id/playlists', routes.user.getPlaylists);
api.get('/user/:id/collaborations', routes.auth.isAuthenticated, routes.user.getCollaborations);
api.get('/user/:id/likes', routes.auth.isAuthenticated, routes.user.getLikes);

/* ====================================================== */

// Playlist endpoints
api.get('/playlist/:identifier', routes.playlist.get);
api.get('/playlist/search/:query', routes.playlist.search);
api.put('/playlist', routes.auth.isAuthenticated, routes.playlist.create);
api.post('/playlist/:id/like', routes.auth.isAuthenticated, routes.playlist.like);
api.delete('/playlist/:id', routes.auth.isAuthenticated, routes.playlist.delete);
api.put('/playlist/:id/track', routes.auth.isAuthenticated, routes.playlist.addTrack);
api.delete('/playlist/:playlistId/track/:trackId', routes.auth.isAuthenticated, routes.playlist.removeTrack);

/* ====================================================== */

// Track endpoints
api.get('/track/:id', routes.track.get);
api.post('/track/:id/upvote', routes.auth.isAuthenticated, routes.track.upvote);
api.post('/track/:id/downvote', routes.auth.isAuthenticated, routes.track.downvote);
api.put('/track/:id/comment', routes.auth.isAuthenticated, routes.track.addComment);
api.delete('/track/:id/comment/:commentId', routes.auth.isAuthenticated, routes.track.removeComment);

/* ====================================================== */


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