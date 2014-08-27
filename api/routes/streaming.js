'use strict';

var Q      = require('q');
var config = require('../../config');

exports.youtube = function(req, res) {
  // https://github.com/jameskyburz/youtube-audio-stream

  res.send('Youtube video ID: ' + req.params.videoId);
};

exports.soundcloud = function(req, res) {
  // write my own API wrapper?

  res.send('Soundcloud song ID: ' + req.params.songId);
};

exports.spotify = function(req, res) {
  // https://github.com/Floby/node-libspotify

  res.send('Spotify song ID: ' + req.params.songId);
};

exports.bandcamp = function(req, res) {
  // parse the page loaded by songUrl
  // direct link to the mp3 is in a script tag,
  // within an object called `TralbumData`,
  // a nested object called `trackinfo`,
  // at the key `mp3-128`

  var songUrl = req.params.songUrl || 'http://wearelions.bandcamp.com/track/defeating-verbs';

  res.send('bandcamp song URL: ' + songUrl);
};