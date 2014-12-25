'use strict';

var Reflux       = require('reflux');

var UserActions   = require('../actions/UserActions');
var UserAPI       = require('../utils/UserAPI');

var ViewingProfileStore = Reflux.createStore({

  init: function() {
    this.profile = null;

    this.listenTo(UserActions.openProfile, this.loadUserProfile);
    this.listenTo(UserActions.follow, this.followUser);
  },

  loadUserProfile: function(username, cb) {
    cb = cb || function() {};

    console.log('load user profile for:', username);

    UserAPI.get(username).then(function(profile) {
      this.profile = profile;
      this.trigger(null, this.profile);
      cb(null, this.profile);

      UserAPI.getPlaylists(this.profile.id).then(function(playlists) {
        this.profile.playlists = playlists;
        this.trigger(null, this.profile);
      }.bind(this));

      UserAPI.getCollaborations(this.profile.id).then(function(collaborations) {
        this.profile.collaborations = collaborations;
        this.trigger(null, this.profile);
      }.bind(this));

      UserAPI.getLikes(this.profile.id).then(function(likes) {
        this.profile.likes = likes;
        this.trigger(null, this.profile);
      }.bind(this));

      UserAPI.getStars(this.profile.id).then(function(stars) {
        this.profile.starredTracks = stars;
        this.trigger(null, this.profile);
      }.bind(this));
    }.bind(this));
  },

  followUser: function(user, cb) {
    cb = cb || function() {};

    console.log('follow user:', user.id);

    UserAPI.follow(user.id).then(function() {
      cb(null);
    }).catch(function(err) {
      cb(err);
    });
  }

});

module.exports = ViewingProfileStore;