'use strict';

var Reflux           = require('reflux');

var GlobalActions    = require('../actions/GlobalActions');
var CurrentUserStore = require('./CurrentUserStore');
var UserAPI          = require('../utils/UserAPI');

var UserLikesStore = Reflux.createStore({

  init: function() {
    this.currentUserLikes = null;

    this.listenTo(GlobalActions.loadUserLikes, this.loadCurrentUserLikes);
  },

  loadCurrentUserLikes: function(cb) {
    if ( CurrentUserStore.user && CurrentUserStore.user.id ) {
      cb = cb || function() {};

      console.log('load liked playlists for:', CurrentUserStore.user.id);

      UserAPI.getLikes(CurrentUserStore.user.id).then(function(playlists) {
        this.currentUserCollaborations = playlists;
        this.trigger(playlists);
        cb(playlists);
      }.bind(this));
    }
  }

});

module.exports = UserLikesStore;