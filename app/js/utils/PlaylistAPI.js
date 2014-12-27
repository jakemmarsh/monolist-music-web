'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var PlaylistAPI = {

  get: function(identifier) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'playlist/' + identifier).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  search: function(query) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'playlist/search/' + query).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  create: function(playlist) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'playlist', playlist).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  recordPlay: function(playlistId) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'playlist/' + playlistId + '/play').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  follow: function(playlistId) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'playlist/' + playlistId + '/follow').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  addCollaborator: function(playlistId, userId) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'playlist/' + playlistId + '/collaborator/' + userId).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  removeCollaborator: function(playlistId, userId) {
    var deferred = when.defer();

    request.del(APIUtils.API_ROOT + 'playlist/' + playlistId + '/collaborator/' + userId).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  like: function(playlistId) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'playlist/' + playlistId + '/like').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  addTrack: function(playlistId, track) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'playlist/' + playlistId + '/track', track).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
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
        deferred.reject(APIUtils.normalizeResponse(res));
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
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = PlaylistAPI;