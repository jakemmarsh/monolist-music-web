'use strict';

var path       = require('path');
var Q          = require('q');
var bandcamp   = require(path.join(__dirname, 'music_sources/bandcamp'));
var soundcloud = require(path.join(__dirname, 'music_sources/soundcloud'));
var spotify    = require(path.join(__dirname, 'music_sources/spotify'));
var youtube    = require(path.join(__dirname, 'music_sources/youtube'));

/* ====================================================== */

module.exports = function(req, res) {

  var searchResults;

  // Search all resources. Bandcamp, Spotify, Soundcloud, etc.
  Q.all([
    bandcamp.search(req.params.query),
    soundcloud.search(req.params.query),
    spotify.search(req.params.query),
    youtube.search(req.params.query)
  ]).spread(function(bandcampResults, soundcloudResults, spotifyResults, youtubeResults) {
    searchResults = bandcampResults.concat(soundcloudResults, spotifyResults, youtubeResults);
    res.status(200).json(searchResults);
  }, function(error) {
    res.status(500).send(error);
  });

};