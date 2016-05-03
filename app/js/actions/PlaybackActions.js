'use strict';

import Reflux from 'reflux';

const PlaybackActions = Reflux.createActions([

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
