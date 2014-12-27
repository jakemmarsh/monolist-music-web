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

    if ( playlist.id && playlist.id !== this.playlist.id ) {
      PlaylistAPI.recordPlay(playlist.id);
    }

    this.playlist = playlist;
    cb();

    this.trigger(playlist);
  }

});

module.exports = CurrentPlaylistStore;