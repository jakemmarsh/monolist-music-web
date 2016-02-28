'use strict';

import Reflux from 'reflux';

var PlaybackActions = Reflux.createActions([

  'updateVolume',
  'seek',
  'previousTrack',
  'nextTrack',
  'togglePlay',
  'toggleRepeat',
  'toggleShuffle',
  'sortPlaylist'

]);

export default PlaybackActions;
