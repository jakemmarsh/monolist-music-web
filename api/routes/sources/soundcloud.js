'use strict';

var path    = require('path');
var Q       = require('q');
var request = require('request');
var config  = require(path.join(__dirname, '../../../config'));
var SC      = require(path.join(__dirname, '../../../../node-soundcloud'));

/* ====================================================== */

SC.init({
  id: config.soundcloud.id,
  secret: config.soundcloud.secret,
  uri: 'localhost:3000/api/sc_redirect'
});

/* ====================================================== */

exports.redirect = function(req, res) {

  var code = req.query.code;

  // authorize and get an access token
  SC.authorize(code);

  res.status(200);

};

/* ====================================================== */

exports.search = function(query) {

  var mainDeferred = Q.defer();

  var getSearchResults = function(searchQuery) {
    var deferred = Q.defer();
    var queryUrl = ('/tracks?q=' + searchQuery.replace(' ', '%20'));
    var searchResults = [];
    var trackResult;

    SC.get(queryUrl, function(error, results) {
      if ( error ) {
        deferred.reject(error);
      }

      results.forEach(function(track) {
        trackResult = {
          source: 'soundcloud',
          title: track.title,
          id: track.id
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