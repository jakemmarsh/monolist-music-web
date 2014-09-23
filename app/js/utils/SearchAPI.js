'use strict';

var Q        = require('q');

var APIUtils = require('./APIUtils');

var UserAPI = {

  get: function(query) {
    var deferred = Q.defer();

    // TODO: don't hardcode sources
    APIUtils.request('search/' + query + '?sources=soundcloud,youtube,bandcamp').end(function (res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = UserAPI;