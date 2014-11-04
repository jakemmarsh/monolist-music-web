'use strict';

var Reflux           = require('reflux');

var GlobalActions    = require('../actions/GlobalActions');
var PlaylistActions  = require('../actions/PlaylistActions');
var CurrentUserStore = require('./CurrentUserStore');
var UserAPI          = require('../utils/UserAPI');
var PlaylistAPI      = require('../utils/PlaylistAPI');

var UserCollaborationsStore = Reflux.createStore({

  init: function() {
    this.listenTo(GlobalActions.loadUserCollaborations, this.loadCurrentUserCollaborations);
    this.listenTo(PlaylistActions.delete, this.deletePlaylist);
  },

  loadCurrentUserCollaborations: function(cb) {
    cb = cb || function() {};

    console.log('load for:', CurrentUserStore.user.id);

    UserAPI.getCollaborations(CurrentUserStore.user.id).then(function(playlists) {
      this.currentUserCollaborations = playlists;
      this.trigger(playlists);
      cb(playlists);
    }.bind(this));
  },

  deletePlaylist: function(playlistId, cb) {
    cb = cb || function() {};

    console.log('delete from collaborations');

    PlaylistAPI.delete(playlistId).then(function() {
      this.loadUserCollaborations(CurrentUserStore.user.id, cb);
    }.bind(this));
  }

});

module.exports = UserCollaborationsStore;