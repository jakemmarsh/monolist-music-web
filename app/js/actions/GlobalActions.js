'use strict';

var Reflux = require('reflux');

var GlobalActions = Reflux.createActions([

  'loadUserEditablePlaylists',
  'loadUserLikes',

  'openUserProfile',

  'doTrackSearch',
  'doPlaylistSearch'

]);

module.exports = GlobalActions;