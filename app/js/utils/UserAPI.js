'use strict';

var APIUtils = require('./APIUtils');

var UserAPI = {

  get: function(identifier) {
    return APIUtils.get('user/' + identifier);
  },

  update: function(userId, updates) {
    return APIUtils.patch('user/' + userId, updates);
  },

  getNotifications: function(userId) {
    return APIUtils.get('user/' + userId + '/notifications');
  },

  markNotificationsAsRead: function(userId, ids) {
    if ( ids.constructor === Array ) {
      ids = ids.join(',');
    }

    return APIUtils.post('user/' + userId + '/notifications/' + ids + '/read');
  },

  follow: function(userId) {
    return APIUtils.post('user/' + userId + '/follow');
  },

  getEditablePlaylists: function(userId) {
    return APIUtils.get('user/' + userId + '/editable');
  },

  getPlaylists: function(userId) {
    return APIUtils.get('user/' + userId + '/playlists');
  },

  getCollaborations: function(userId) {
    return APIUtils.get('user/' + userId + '/collaborations');
  },

  getLikes: function(userId) {
    return APIUtils.get('user/' + userId + '/likes');
  },

  getStars: function(userId) {
    return APIUtils.get('user/' + userId + '/stars');
  }

};

module.exports = UserAPI;