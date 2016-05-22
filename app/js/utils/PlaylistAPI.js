'use strict';

import APIUtils from './APIUtils';

const PlaylistAPI = {

  get(slug) {
    return APIUtils.get('playlist/' + slug);
  },

  getNewest() {
    return APIUtils.get('playlists/newest');
  },

  getTrending() {
    return APIUtils.get('playlists/trending');
  },

  getTopForWindow(window) {
    return APIUtils.get(`playlists/trending?window=${window}`);
  },

  getUserRecentlyPlayed(userId) {
    return APIUtils.get(`playlists/played/recent?userId=${userId}`);
  },

  getGlobalRecentlyPlayed(window = 'day') {
    return APIUtils.get(`playlists/played/recent?window=${window}`);
  },

  getRecentSearches() {
    return APIUtils.get('playlists/searches');
  },

  search(query) {
    return APIUtils.get('playlists/search/' + query);
  },

  create(playlist) {
    return APIUtils.post('playlist', playlist);
  },

  update(playlistId, updates) {
    return APIUtils.patch(`playlist/${playlistId}`, updates);
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

  reorderTracks(playlistId, updates) {
    return APIUtils.post(`playlist/${playlistId}/reorder`, updates);
  },

  identifyTracks(playlistId) {
    return APIUtils.post(`playlist/${playlistId}/identify`);
  },

  delete(playlistId) {
    return APIUtils.del('playlist/' + playlistId);
  }

};

export default PlaylistAPI;
