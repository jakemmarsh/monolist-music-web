'use strict';

var when     = require('q');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var UserAPI = {

  get: function(username) {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'user/' + username).end(function(res) {
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
  }

};

module.exports = UserAPI;