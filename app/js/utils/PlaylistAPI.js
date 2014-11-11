'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var PlaylistAPI = {

  get: function(id) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'playlist/' + id).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  create: function(playlist) {
    var deferred = when.defer();

    request.put(APIUtils.API_ROOT + 'playlist', playlist).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  like: function(playlistId, userId) {
    var deferred = when.defer();

    // request.put(APIUtils.API_ROOT + 'playlist/' + playlistId + '/like/' + userId).end(function(res) {
    //   if ( !res.ok ) {
    //     deferred.reject(res.text);
    //   } else {
    //     deferred.resolve(APIUtils.normalizeResponse(res));
    //   }
    // });

    deferred.resolve();

    return deferred.promise;
  },

  addTrack: function(playlistId, track) {
    var deferred = when.defer();

    request.put(APIUtils.API_ROOT + 'playlist/' + playlistId + '/track', track).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  removeTrack: function(playlistId, trackId) {
    var deferred = when.defer();

    request.del(APIUtils.API_ROOT + 'playlist/' + playlistId + '/track/' + trackId).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  delete: function(playlistId) {
    var deferred = when.defer();

    request.del(APIUtils.API_ROOT + 'playlist/' + playlistId).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = PlaylistAPI;