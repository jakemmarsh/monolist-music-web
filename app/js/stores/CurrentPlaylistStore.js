'use strict';

var Reflux          = require('reflux');

var PlaylistActions = require('../actions/PlaylistActions');
var PlaylistAPI     = require('../utils/PlaylistAPI');

var CurrentPlaylistStore = Reflux.createStore({

  init: function() {
    this.playlist = null;

    this.listenTo(PlaylistActions.play, this.selectPlaylist);
  },

  selectPlaylist: function(playlist, cb) {
    cb = cb || function() {};

    console.log('select playlist:', playlist);

    this.playlist = playlist;
    cb();

    if ( playlist.id ) {
      PlaylistAPI.recordPlay(this.playlist.id);
    }

    this.trigger(playlist);
  }

});

module.exports = CurrentPlaylistStore;