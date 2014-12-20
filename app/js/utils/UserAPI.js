'use strict';

var when     = require('q');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var UserAPI = {

  get: function(identifier) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'user/' + identifier).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  update: function(userId, updates) {
    var deferred = when.defer();

    request.patch(APIUtils.API_ROOT + 'user/' + userId, updates).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  follow: function(userId) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'user/' + userId + '/follow').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  getEditablePlaylists: function(userId) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'user/' + userId + '/editable').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  getPlaylists: function(userId) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'user/' + userId + '/playlists').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  getCollaborations: function(userId) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'user/' + userId + '/collaborations').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  getLikes: function(userId) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'user/' + userId + '/likes').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  getStars: function(userId) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'user/' + userId + '/stars').end(function(res) {
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