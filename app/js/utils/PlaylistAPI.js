'use strict';

import APIUtils from './APIUtils';

var PlaylistAPI = {

  get(slug) {
    return APIUtils.get('playlist/' + slug);
  },

  search(query) {
    return APIUtils.get('playlists/search/' + query);
  },

  create(playlist) {
    return APIUtils.post('playlist', playlist);
  },

  recordPlay(playlistId) {
    return APIUtils.post('playlist/' + playlistId + '/play');
  },

  follow(playlistId) {
    return APIUtils.post('playlist/' + playlistId + '/follow');
  },

  addCollaborator(playlistId, userId) {
    return APIUtils.post('playlist/' + playlistId + '/collaborator/' + userId);
  },

  removeCollaborator(playlistId, userId) {
    return APIUtils.del('playlist/' + playlistId + '/collaborator/' + userId);
  },

  like(playlistId) {
    return APIUtils.post('playlist/' + playlistId + '/like');
  },

  addTrack(playlistId, track) {
    return APIUtils.post('playlist/' + playlistId + '/track', track);
  },

  removeTrack(playlistId, trackId) {
    return APIUtils.del('playlist/' + playlistId + '/track/' + trackId);
  },

  delete(playlistId) {
    return APIUtils.del('playlist/' + playlistId);
  }

};

export default PlaylistAPI;