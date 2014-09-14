'use strict';

var path       = require('path');
var bandcamp   = require(path.join(__dirname, 'music_sources/bandcamp'));
var soundcloud = require(path.join(__dirname, 'music_sources/soundcloud'));
var spotify    = require(path.join(__dirname, 'music_sources/spotify'));
var youtube    = require(path.join(__dirname, 'music_sources/youtube'));

/* ====================================================== */

exports.bandcamp   = bandcamp.stream;
exports.soundcloud = soundcloud.stream;
exports.spotify    = spotify.stream;
exports.youtube    = youtube.stream;