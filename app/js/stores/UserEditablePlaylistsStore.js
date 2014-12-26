'use strict';

var Reflux               = require('reflux');

var GlobalActions        = require('../actions/GlobalActions');
var PlaylistActions      = require('../actions/PlaylistActions');
var CurrentUserStore     = require('./CurrentUserStore');
var CurrentPlaylistStore = require('./CurrentPlaylistStore');
var UserAPI              = require('../utils/UserAPI');
var PlaylistAPI          = require('../utils/PlaylistAPI');

var UserEditablePlaylistsStore = Reflux.createStore({

  init: function() {
    this.playlists = null;

    this.listenTo(GlobalActions.loadUserEditablePlaylists, this.loadCurrentUserEditablePlaylists);
    this.listenTo(PlaylistActions.create, this.createPlaylist);
    this.listenTo(PlaylistActions.addTrack, this.addTrackToPlaylist);
  },

  loadCurrentUserEditablePlaylists: function(cb) {
    if ( CurrentUserStore.user && CurrentUserStore.user.id ) {
      cb = cb || function() {};

      console.log('load collaborations for:', CurrentUserStore.user.id);

      UserAPI.getEditablePlaylists(CurrentUserStore.user.id).then(function(playlists) {
        this.playlists = playlists;
        this.trigger(this.playlists);
        cb(playlists);
      }.bind(this));
    }
  },

  createPlaylist: function(playlist, cb) {
    cb = cb || function() {};

    console.log('create playlist:', playlist);

    PlaylistAPI.create(playlist).then(function(createdPlaylist) {
      cb(null, createdPlaylist);
      GlobalActions.loadUserEditablePlaylists();
    }.bind(this)).catch(function(err) {
      cb(err);
    });
  },

  addTrackToPlaylist: function(playlist, track, cb) {
    cb = cb || function() {};

    console.log('add track to playlist:', playlist);

    PlaylistAPI.addTrack(playlist.id, track).then(function(modifiedPlaylist) {
      cb(modifiedPlaylist);

      // Update play queue if changing current playlist
      if ( CurrentPlaylistStore.playlist && CurrentPlaylistStore.playlist.id === modifiedPlaylist.id ) {
        PlaylistActions.play(modifiedPlaylist);
      }
    }.bind(this));
  }

});

module.exports = UserEditablePlaylistsStore;