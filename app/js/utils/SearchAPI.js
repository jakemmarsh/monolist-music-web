'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var SearchAPI = {

  trackSearch: function(query, sources) {
    var deferred = when.defer();

    if ( sources && sources.length ) {
      sources = sources.join(',');
    } else {
      sources = 'soundcloud,youtube,bandcamp';
    }

    request.get(APIUtils.API_ROOT + 'track/search/' + query + '?sources=' + sources).end(function (res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  playlistSearch: function(query) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'playlist/search/' + query).end(function (res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = SearchAPI;