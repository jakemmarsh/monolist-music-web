'use strict';

var path    = require('path');
var Q       = require('q');
var request = require('request');
var config  = require(path.join(__dirname, '../../../config'));
var SC      = require(path.join(__dirname, '../../../lib/soundcloud'));

/* ====================================================== */

SC.init({
  id: config.soundcloud.id,
  secret: config.soundcloud.secret
});

/* ====================================================== */

exports.redirect = function(req, res) {

  var code = req.query.code;

  // authorize and get an access token
  SC.authorize(code);

  res.status(200);

};

/* ====================================================== */

exports.search = function(query, limit) {

  var mainDeferred = Q.defer();

  var getSearchResults = function(searchQuery) {
    var deferred = Q.defer();
    var queryUrl = '/tracks?q=';
    var searchResults = [];
    var trackResult;

    searchQuery = searchQuery.replace(' ', '%20');

    queryUrl += searchQuery;
    queryUrl += '&limit=' + limit;

    SC.get(queryUrl, function(error, results) {
      if ( error ) {
        deferred.reject(error);
      }

      results.forEach(function(item) {
        trackResult = {
          source: 'soundcloud',
          title: item.title,
          image: item.artwork_url ? item.artwork_url/*.replace('large', 't500x500')*/ : null,
          id: item.id
        };

        searchResults.push(trackResult);
      });

      deferred.resolve(searchResults);
    });

    return deferred.promise;
  };

  getSearchResults(query).then(function(results) {
    mainDeferred.resolve(results);
  }, function() {
    mainDeferred.reject('Unable to retrieve Soundcloud search results.');
  });

  return mainDeferred.promise;

};

/* ====================================================== */

exports.stream = function(req, res) {

  var getTrack = function(songId) {
    var deferred = Q.defer();

    var queryUrl = '/tracks/' + songId + '/stream';

    SC.get(queryUrl, function(error, trackInfo) {
      if ( error ) {
        deferred.reject(error);
      }

      deferred.resolve(request.get(trackInfo.location));
    });

    return deferred.promise;
  };

  getTrack(req.params.songId).then(function(track) {
    track.pipe(res);
  }, function(error) {
    res.status(500).send(error);
  });

};