'use strict';

var Reflux       = require('reflux');

var PlaylistActions = require('../actions/PlaylistActions');
var PlaylistAPI     = require('../utils/PlaylistAPI');

var ViewingPlaylistStore = Reflux.createStore({

  init: function() {
    this.listenTo(PlaylistActions.open, this.loadPlaylist);
    this.listenTo(PlaylistActions.removeTrack, this.removeTrackFromPlaylist);
    this.listenTo(PlaylistActions.delete, this.deleteIfViewing);
  },

  loadPlaylist: function(playlistId, cb) {
    cb = cb || function() {};

    console.log('load playlist');

    PlaylistAPI.get(playlistId).then(function(playlist) {
      console.log('loaded:', playlist);
      this.playlist = playlist;
      this.trigger(playlist);
      cb(playlist);
    }.bind(this));
  },

  removeTrackFromPlaylist: function(playlist, track, cb) {
    cb = cb || function() {};

    console.log('remove track from playlist');

    PlaylistAPI.removeTrack(playlist.id, track.id).then(function() {
      this.loadPlaylist(playlist.id, cb);
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