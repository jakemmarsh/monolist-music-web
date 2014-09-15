'use strict';

var path       = require('path');
var Q          = require('q');
var bandcamp   = require(path.join(__dirname, 'sources/bandcamp'));
var soundcloud = require(path.join(__dirname, 'sources/soundcloud'));
var spotify    = require(path.join(__dirname, 'sources/spotify'));
var youtube    = require(path.join(__dirname, 'sources/youtube'));

/* ====================================================== */

module.exports = function(req, res) {

  var searchSources = [];
  var searchResults;
  var sources;

  if ( req.params.sources ) {
    sources = req.params.sources.split(',');
    sources.forEach(function(searchSource) {
      if ( searchSource.toLowerCase() === 'bandcamp' ) {
        searchSources.push(bandcamp.search(req.params.query));
      } else if ( searchSource.toLowerCase() === 'soundcloud' ) {
        searchSources.push(soundcloud.search(req.params.query));
      } else if ( searchSource.toLowerCase() === 'spotify' ) {
        searchSources.push(spotify.search(req.params.query));
      } else if ( searchSource.toLowerCase() === 'youtube' ) {
        searchSources.push(youtube.search(req.params.query));
      }
    });
  } else {
    searchSources = [
      bandcamp.search(req.params.query),
      soundcloud.search(req.params.query),
      spotify.search(req.params.query),
      youtube.search(req.params.query)
    ];
  }

  // Search all resources
  Q.all(searchSources).then(function(results) {
    results.forEach(function(result) {
      searchResults.push(result);
    });
    res.status(200).json(searchResults);
  }, function(error) {
    res.status(500).send(error);
  });

};