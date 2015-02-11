'use strict';

var APIUtils = require('./APIUtils');

var PlaylistAPI = {

  get: function(identifier) {
    return APIUtils.get('playlist/' + identifier);
  },

  search: function(query) {
    return APIUtils.get('playlist/search/' + query);
  },

  create: function(playlist) {
    return APIUtils.post('playlist', playlist);
  },

  recordPlay: function(playlistId) {
    return APIUtils.post('playlist/' + playlistId + '/play');
  },

  follow: function(playlistId) {
    return APIUtils.post('playlist/' + playlistId + '/follow');
  },

  addCollaborator: function(playlistId, userId) {
    return APIUtils.post('playlist/' + playlistId + '/collaborator/' + userId);
  },

  removeCollaborator: function(playlistId, userId) {
    return APIUtils.del('playlist/' + playlistId + '/collaborator/' + userId);
  },

  like: function(playlistId) {
    return APIUtils.post('playlist/' + playlistId + '/like');
  },

  addTrack: function(playlistId, track) {
    return APIUtils.post('playlist/' + playlistId + '/track', track);
  },

  removeTrack: function(playlistId, trackId) {
    return APIUtils.del('playlist/' + playlistId + '/track/' + trackId);
  },

  delete: function(playlistId) {
    return APIUtils.del('playlist/' + playlistId);
  }

};

module.exports = PlaylistAPI;