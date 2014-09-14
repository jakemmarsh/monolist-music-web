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
  }, function() {
    mainDeferred.reject('Unable to retrieve Soundcloud search results.');
  });

  return mainDeferred.promise;

};

/* ====================================================== */

exports.stream = function(req, res) {

  // write my own API wrapper?

  res.send('Soundcloud song ID: ' + req.params.songId);

};