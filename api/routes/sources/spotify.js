'use strict';

var Q       = require('q');
var request = require('request');
var _       = require('underscore');

/* ====================================================== */

exports.search = function(query, limit) {

  var mainDeferred = Q.defer();

  var getSearchResults = function(searchQuery) {
    var deferred = Q.defer();
    var searchUrl = 'https://api.spotify.com/v1/search?q=';
    var searchResults;

    searchQuery = searchQuery.replace('%20', '+').replace(' ', '+');

    searchUrl += searchQuery;
    searchUrl += '&type=track';
    searchUrl += '&limit=' + limit;

    request(searchUrl, function(error, response, body){
      if ( error ) {
        deferred.reject(error);
      }

      // convert from string to JSON
      body = JSON.parse(body);

      if ( body.tracks ) {
        // process each search result
        searchResults = _.map(body.tracks.items, function(item) {
          return {
            source: 'spotify',
            title: item.name,
            album: item.album ? item.album.name : null,
            artist: item.artists ? item.artists[0].name : null,
            image: item.album ? item.album.images[0].url : null,
            id: item.id,
            url: item.preview_url
          };
        });
      }

      deferred.resolve(searchResults);
    });

    return deferred.promise;
  };

  getSearchResults(query).then(function(results) {
    mainDeferred.resolve(results);
  }, function(error) {
    mainDeferred.reject(error);
  });

  return mainDeferred.promise;

};

/* ====================================================== */

exports.stream = function(req, res) {

  // http://www.node-spotify.com/

  res.send('Spotify song ID: ' + req.params.songId);

};