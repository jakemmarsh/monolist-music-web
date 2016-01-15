'use strict';

import Reflux           from 'reflux';

import TrackActions     from '../actions/TrackActions';
import Mixpanel         from '../utils/Mixpanel';

var CurrentTrackStore = Reflux.createStore({

  init() {
    this.listenTo(TrackActions.select, this.selectTrack);
  },

  selectTrack(track, index, cb = function() {}) {
    this.track = track;
    this.currentIndex = index;
    Mixpanel.logEvent('play track', {
      track: track
    });

    this.trigger(track, index);
    cb(track, index);
  }

});

export default CurrentTrackStore;