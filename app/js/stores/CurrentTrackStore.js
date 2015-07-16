'use strict';

import Reflux       from 'reflux';

import TrackActions from '../actions/TrackActions';

var CurrentTrackStore = Reflux.createStore({

  init() {
    this.listenTo(TrackActions.select, this.selectTrack);
  },

  selectTrack(track, index, cb = function() {}) {
    console.log('select track:', track);

    this.track = track;
    this.currentIndex = index;
    this.trigger(track, index);
    cb(track, index);
  }

});

export default CurrentTrackStore;