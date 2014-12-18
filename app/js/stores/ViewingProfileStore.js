'use strict';

var Reflux       = require('reflux');

var GlobalActions = require('../actions/GlobalActions');
var UserAPI       = require('../utils/UserAPI');

var ViewingProfileStore = Reflux.createStore({

  init: function() {
    this.profile = null;

    this.listenTo(GlobalActions.openUserProfile, this.loadUserProfile);
  },

  loadUserProfile: function(username, cb) {
    cb = cb || function() {};

    console.log('load user profile');

    UserAPI.get(username).then(function(profile) {
      this.profile = profile;
      this.trigger(this.profile);
      cb(this.profile);

      UserAPI.getPlaylists(this.profile.id).then(function(playlists) {
        this.profile.playlists = playlists;
        this.trigger(this.profile);
      }.bind(this));

      UserAPI.getCollaborations(this.profile.id).then(function(collaborations) {
        this.profile.collaborations = collaborations;
        this.trigger(this.profile);
      }.bind(this));

      UserAPI.getLikes(this.profile.id).then(function(likes) {
        this.profile.likes = likes;
        this.trigger(this.profile);
      }.bind(this));

      UserAPI.getStars(this.profile.id).then(function(stars) {
        this.profile.stars = stars;
        this.trigger(this.profile);
      }.bind(this));
    }.bind(this));
  }

});

module.exports = ViewingProfileStore;