'use strict';

var path       = require('path');
var Q          = require('q');
var _          = require('underscore');
var bandcamp   = require(path.join(__dirname, 'sources/bandcamp'));
var soundcloud = require(path.join(__dirname, 'sources/soundcloud'));
var spotify    = require(path.join(__dirname, 'sources/spotify'));
var youtube    = require(path.join(__dirname, 'sources/youtube'));

/* ====================================================== */

module.exports = function(req, res) {

  var searchResults = [];
  var limit = req.query.limit || 20;

  /*
   * If user has specified `sources` in the query string,
   * split at commas and add each source's search promise to the
   * searchPromises (if it exists in the mapping). Otherwise,
   * add all 4 possible sources to the searchPromises.
   */
  var getSearchPromises = function() {
    var sourcePromisesMap = {
      'bandcamp': bandcamp.search(req.params.query, limit),
      'soundcloud': soundcloud.search(req.params.query, limit),
      'spotify': spotify.search(req.params.query, limit),
      'youtube': youtube.search(req.params.query, limit)
    };
    var searchPromises = [];
    var sources;

    // Limit search if user specifies sources
    if ( req.query.sources ) {
      sources = req.query.sources.split(',');
      sources.forEach(function(searchSource) {
        if ( searchSource.toLowerCase() in sourcePromisesMap ) {
          searchPromises.push(sourcePromisesMap[searchSource.toLowerCase()]);
        }
      });
    } else {
      searchPromises = [
        sourcePromisesMap.bandcamp,
        sourcePromisesMap.soundcloud,
        sourcePromisesMap.spotify,
        sourcePromisesMap.youtube
      ];
    }

    return searchPromises;
  };

  // Search all specified resources
  Q.all(getSearchPromises()).then(function(results) {
    results.forEach(function(result) {
      searchResults = _.sortBy(searchResults.concat(result), 'title');
    });
    res.status(200).json(searchResults);
  }, function(err) {
    res.status(500).send(err);
  });

};