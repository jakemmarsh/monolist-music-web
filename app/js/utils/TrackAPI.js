'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var TrackAPI = {

  upvote: function(trackId, upvote) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'track/' + trackId + '/upvote', upvote).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  downvote: function(trackId, downvote) {
    var deferred = when.defer();

    request.post(APIUtils.API_ROOT + 'track/' + trackId + '/downvote', downvote).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  },

  addComment: function(trackId, comment) {
    var deferred = when.defer();

    request.put(APIUtils.API_ROOT + 'track/' + trackId + '/comment', comment).end(function(res) {
      if ( !res.ok ) {
        deferred.reject(res.text);
      } else {
        deferred.resolve(APIUtils.normalizeResponse(res));
      }
    });

    return deferred.promise;
  }

};

module.exports = TrackAPI;