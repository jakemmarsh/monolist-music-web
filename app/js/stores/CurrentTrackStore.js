'use strict';

var Reflux       = require('reflux');

var TrackActions = require('../actions/TrackActions');

var CurrentTrackStore = Reflux.createStore({

  init: function() {
    this.listenTo(TrackActions.select, this.selectTrack);
    this.listenTo(TrackActions.star, this.starTrack);
  },

  selectTrack: function(track, index, cb) {
    cb = cb || function() {};

    console.log('select track:', track);

    this.track = track;
    this.currentIndex = index;
    this.trigger(track, index);
    cb(track, index);
  }

});

module.exports = CurrentTrackStore;