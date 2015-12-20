'use strict';

import Reflux       from 'reflux';

import TrackActions from '../actions/TrackActions';

var CurrentTrackStore = Reflux.createStore({

  init() {
    this.listenTo(TrackActions.select, this.selectTrack);
  },

  selectTrack(track, index, cb = function() {}) {
    this.track = track;
    this.currentIndex = index;
    this.trigger(track, index);
    cb(track, index);
  }

});

export default CurrentTrackStore;