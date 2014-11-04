'use strict';

var Reflux       = require('reflux');

var PlaylistActions = require('../actions/PlaylistActions');
var PlaylistAPI     = require('../utils/PlaylistAPI');

var ViewingPlaylistStore = Reflux.createStore({

  init: function() {
    this.listenTo(PlaylistActions.open, this.loadPlaylist);
    this.listenTo(PlaylistActions.delete, this.deleteIfViewing);
  },

  loadPlaylist: function(playlistId, cb) {
    cb = cb || function() {};

    console.log('load playlist');

    PlaylistAPI.get(playlistId).then(function(playlist) {
      this.playlist = playlist;
      this.trigger(playlist);
      cb(playlist);
    }.bind(this));
  },

  deleteIfViewing: function(playlistId) {
    if ( playlistId === this.playlist.id ) {
      console.log('delete if viewing');
      this.playlist = null;
      this.trigger(null);
    }
  }

});

module.exports = ViewingPlaylistStore;