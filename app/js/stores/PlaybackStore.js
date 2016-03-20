'use strict';

import Reflux          from 'reflux';

import PlaybackActions from '../actions/PlaybackActions';

const PlaybackStore = Reflux.createStore({

  init() {
    this.track = null;
    this.currentIndex = null;

    this.listenTo(PlaybackActions.updateVolume, this.updateVolume);
    this.listenTo(PlaybackActions.seek, this.seek);
    this.listenTo(PlaybackActions.previousTrack, this.previousTrack);
    this.listenTo(PlaybackActions.nextTrack, this.nextTrack);
    this.listenTo(PlaybackActions.togglePlay, this.togglePlay);
    this.listenTo(PlaybackActions.toggleRepeat, this.toggleRepeat);
    this.listenTo(PlaybackActions.toggleShuffle, this.toggleShuffle);
    this.listenTo(PlaybackActions.sortPlaylist, this.sortPlaylist);
  },

  updateVolume(newVolume = 0.7) {
    this.trigger('updateVolume', newVolume);
  },

  seek(newTime = 0) {
    this.trigger('seek', newTime);
  },

  previousTrack() {
    this.trigger('previousTrack');
  },

  nextTrack() {
    this.trigger('nextTrack');
  },

  togglePlay() {
    this.trigger('togglePlay');
  },

  toggleRepeat() {
    this.trigger('toggleRepeat');
  },

  toggleShuffle() {
    this.trigger('toggleShuffle');
  },

  sortPlaylist(key, asc = true) {
    this.trigger('sortPlaylist', key, asc);
  }

});

export default PlaybackStore;
