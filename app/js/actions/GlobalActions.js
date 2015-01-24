'use strict';

var Reflux = require('reflux');

var GlobalActions = Reflux.createActions([

  'loadUserEditablePlaylists',
  'loadUserNotifications',
  'markNotificationsAsRead',
  'loadUserLikes',
  'loadExplorePlaylists',
  'doTrackSearch',
  'doPlaylistSearch'

]);

module.exports = GlobalActions;