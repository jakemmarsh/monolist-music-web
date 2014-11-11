'use strict';

var Reflux       = require('reflux');

var PlaylistActions = require('../actions/PlaylistActions');

var CurrentPlaylistStore = Reflux.createStore({

  init: function() {
    this.playlist = null;

    this.listenTo(PlaylistActions.play, this.selectPlaylist);
  },

  selectPlaylist: function(playlist, cb) {
    cb = cb || function() {};

    this.playlist = playlist;

    this.trigger(playlist);

    cb();
  }

});

module.exports = CurrentPlaylistStore;