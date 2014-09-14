'use strict';

var Q = require('q');

/* ====================================================== */

exports.search = function(query) {

  var mainDeferred = Q.defer();

  var getSearchResults = function(searchQuery) {
    var deferred = Q.defer();

    deferred.resolve([]);

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