'use strict';

var Q        = require('q');

var APIUtils = require('./APIUtils');

var PlaylistAPI = {

  get: function(id) {
    var deferred = Q.defer();

    APIUtils.request('playlists/' + id).end(function (res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  create: function(playlist) {
    var deferred = Q.defer();

    console.log('create:', playlist);

    return deferred.promise;
  }

};

module.exports = PlaylistAPI;