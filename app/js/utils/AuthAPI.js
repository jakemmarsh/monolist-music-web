'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var AuthAPI = {

  register: function(user) {
    var deferred = when.defer();

    request.put(APIUtils.API_ROOT + 'auth/register', user).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  check: function() {
    var deferred = when.defer();

    request.get(APIUtils.API_ROOT + 'auth/check').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  login: function(user) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'auth/login', user).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  forgotPassword: function(username) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'auth/forgot/' + username).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  resetPassword: function(userId, resetKey, password) {
    var deferred = when.defer();
    var data = {
      password: password
    };

    request.post(APIUtils.API_ROOT + 'auth/reset/' + userId + '/' + resetKey, data).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  logout: function() {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'auth/logout').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(JSON.parse(res.text));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = AuthAPI;