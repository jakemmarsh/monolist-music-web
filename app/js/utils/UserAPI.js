'use strict';

import APIUtils from './APIUtils';

var UserAPI = {

  get(identifier) {
    return APIUtils.get('user/' + identifier);
  },

  update(userId, updates) {
    return APIUtils.patch('user/' + userId, updates);
  },

  getNotifications(userId) {
    return APIUtils.get('user/' + userId + '/notifications');
  },

  markNotificationsAsRead(userId, ids) {
    if ( ids.constructor === Array ) {
      ids = ids.join(',');
    }

    return APIUtils.post('user/' + userId + '/notifications/' + ids + '/read');
  },

  follow(userId) {
    return APIUtils.post('user/' + userId + '/follow');
  },

  getEditablePlaylists(userId) {
    return APIUtils.get('user/' + userId + '/editable');
  },

  getPlaylists(userId) {
    return APIUtils.get('user/' + userId + '/playlists');
  },

  getCollaborations(userId) {
    return APIUtils.get('user/' + userId + '/collaborations');
  },

  getLikes(userId) {
    return APIUtils.get('user/' + userId + '/likes');
  },

  getStars(userId) {
    return APIUtils.get('user/' + userId + '/stars');
  }

};

export default UserAPI;