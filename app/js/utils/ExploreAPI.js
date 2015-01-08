'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var ExploreAPI = {

  getNewest: function() {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'playlists/newest').end(function(res) {
      console.log('newest res:', res);
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  getTrending: function() {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'playlists/trending').end(function(res) {
      console.log('trending res:', res);
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = ExploreAPI;