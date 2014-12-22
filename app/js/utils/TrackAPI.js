'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var TrackAPI = {

  upvote: function(trackId) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'track/' + trackId + '/upvote').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  downvote: function(trackId) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'track/' + trackId + '/downvote').end(function(res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  addComment: function(trackId, commentBody) {
    var deferred = when.defer();
    var comment = {
      body: commentBody
    };

    request.post(APIUtils.API_ROOT + 'track/' + trackId + '/comment', comment).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  removeComment: function(trackId, commentId) {
    var deferred = when.defer();

    request.del(APIUtils.API_ROOT + 'track/' + trackId + '/comment/' + commentId).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(APIUtils.normalizeResponse(res));
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = TrackAPI;