'use strict';

var APIUtils = require('./APIUtils');

var TrackAPI = {

  star: function(track) {
    return APIUtils.post('track/star', track);
  },

  upvote: function(trackId) {
    return APIUtils.post('track/' + trackId + '/upvote');
  },

  downvote: function(trackId) {
    return APIUtils.post('track/' + trackId + '/downvote');
  },

  addComment: function(trackId, commentBody) {
    return APIUtils.post('track/' + trackId + '/comment', { body: commentBody });
  },

  removeComment: function(trackId, commentId) {
    return APIUtils.del('track/' + trackId + '/comment/' + commentId);
  }

};

module.exports = TrackAPI;