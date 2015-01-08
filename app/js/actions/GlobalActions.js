'use strict';

var Reflux = require('reflux');

var GlobalActions = Reflux.createActions([

  'loadUserEditablePlaylists',
  'loadUserLikes',
  'loadExplorePlaylists',
  'doTrackSearch',
  'doPlaylistSearch'

]);

module.exports = GlobalActions;