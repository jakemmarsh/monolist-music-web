'use strict';

var humps        = require('humps');
var camelizeKeys = humps.camelizeKeys;
var request      = require('superagent');
var when         = require('when');

var APIUtils = {

  root: 'http://localhost:3000/api/v1/',

  getStreamUrl: function(track) {
    var streamUrl = this.root + 'stream/' + track.source + '/' + encodeURIComponent(track.sourceParam);

    return streamUrl;
  },

  normalizeResponse: function(response) {
    return camelizeKeys(response.body);
  },

  get: function(path) {
    var deferred = when.defer();

    request.get(this.root + path)
    .withCredentials()
    .end(function(res) {
      if ( !res.ok ) {
        deferred.reject(this.normalizeResponse(res));
      } else {
        deferred.resolve(this.normalizeResponse(res));
      }
    }.bind(this));

    return deferred.promise;
  },

  post: function(path, body) {
    var deferred = when.defer();

    request.post(this.root + path, body)
    .withCredentials()
    .end(function(res) {
      if ( !res.ok ) {
        deferred.reject(this.normalizeResponse(res));
      } else {
        deferred.resolve(this.normalizeResponse(res));
      }
    }.bind(this));

    return deferred.promise;
  },

  patch: function(path, body) {
    var deferred = when.defer();

    request.patch(this.root + path, body)
    .withCredentials()
    .end(function(res) {
      if ( !res.ok ) {
        deferred.reject(this.normalizeResponse(res));
      } else {
        deferred.resolve(this.normalizeResponse(res));
      }
    }.bind(this));

    return deferred.promise;
  },

  put: function(path, body) {
    var deferred = when.defer();

    request.put(this.root + path, body)
    .withCredentials()
    .end(function(res) {
      if ( !res.ok ) {
        deferred.reject(this.normalizeResponse(res));
      } else {
        deferred.resolve(this.normalizeResponse(res));
      }
    }.bind(this));

    return deferred.promise;
  },

  del: function(path) {
    var deferred = when.defer();

    request.del(this.root + path)
    .withCredentials()
    .end(function(res) {
      if ( !res.ok ) {
        deferred.reject(this.normalizeResponse(res));
      } else {
        deferred.resolve(this.normalizeResponse(res));
      }
    }.bind(this));

    return deferred.promise;
  }

};

module.exports = APIUtils;