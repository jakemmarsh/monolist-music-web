'use strict';

var Q        = require('q');

var APIUtils = require('./APIUtils');

var UserAPI = {

  get: function(query, sources) {
    var deferred = Q.defer();

    if ( sources ) {
      sources = sources.join(',');
    } else {
      sources = 'soundcloud,youtube,bandcamp';
    }

    // TODO: don't hardcode sources
    APIUtils.request('search/' + query + '?sources=' + sources).end(function (res) {
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