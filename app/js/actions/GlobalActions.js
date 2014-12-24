'use strict';

var Reflux = require('reflux');

var GlobalActions = Reflux.createActions([

  'loadUserEditablePlaylists',
  'loadUserLikes',
  'doTrackSearch',
  'doPlaylistSearch'

]);

module.exports = GlobalActions;