'use strict';

var when     = require('when');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var awsAPI = {

  uploadUserImage: function(image, userId) {
    var deferred = when.defer();

    request.post(APIUtils.root + 'upload/user/' + userId)
      .attach('image', image)
      .end(function(res){
        if ( !res.ok ) {
          deferred.reject(APIUtils.normalizeResponse(res));
        } else {
          deferred.resolve(APIUtils.normalizeResponse(res));
        }
      });

    return deferred.promise;
  },

  uploadPlaylistImage: function(image, playlistId) {
    var deferred = when.defer();

    request.post(APIUtils.root + 'upload/playlist/' + playlistId)
      .attach('image', image)
      .end(function(res){
        if ( !res.ok ) {
          deferred.reject(APIUtils.normalizeResponse(res));
        } else {
          deferred.resolve(APIUtils.normalizeResponse(res));
        }
      });

    return deferred.promise;
  }

};

module.exports = awsAPI;