'use strict';

var Reflux       = require('reflux');
var _            = require('lodash');

var UserActions  = require('../actions/UserActions');
var TrackActions = require('../actions/TrackActions');
var AuthAPI      = require('../utils/AuthAPI');
var UserAPI      = require('../utils/UserAPI');
var TrackAPI     = require('../utils/TrackAPI');

var CurrentTrackStore = Reflux.createStore({

  init: function() {
    this.user = null;

    this.listenTo(UserActions.check, this.checkLoginStatus);
    this.listenTo(UserActions.login, this.loginUser);
    this.listenTo(UserActions.facebookLogin, this.loginUserFacebook);
    this.listenTo(UserActions.update, this.updateUser);
    this.listenTo(UserActions.logout, this.logoutUser);
    this.listenTo(TrackActions.star, this.starTrack);
    this.listenTo(TrackActions.unstar, this.unstarTrack);
  },

  checkLoginStatus: function(cb) {
    cb = cb || function() {};

    AuthAPI.check().then(function(user) {
      this.user = user;
      cb(null, this.user);
      this.trigger(null, this.user);
    }.bind(this)).catch(function(err) {
      cb(err);
      this.trigger(err);
    }.bind(this));
  },

  loginUser: function(user, cb) {
    cb = cb || function() {};

    console.log('login user');

    AuthAPI.login(user).then(function(user) {
      this.user = user;
      cb(null, this.user);
      this.trigger(null, this.user);
    }.bind(this)).catch(function(err) {
      cb(err);
      this.trigger(err);
    }.bind(this));
  },

  loginUserFacebook: function(user, cb) {
    cb = cb || function() {};

    console.log('login user via facebook');

    AuthAPI.facebookLogin(user).then(function(user) {
      this.user = user;
      cb(null, this.user);
      this.trigger(null, this.user);
    }.bind(this)).catch(function(err) {
      cb(err);
      this.trigger(err);
    }.bind(this));
  },

  updateUser: function(updates, cb) {
    cb = cb || function() {};

    UserAPI.update(this.user.id, updates).then(function(updatedUser) {
      this.user = updatedUser;
      cb(null, this.user);
      this.trigger(null, this.user);
    }.bind(this)).catch(function(err) {
      cb(err);
    });
  },

  logoutUser: function(cb) {
    cb = cb || function() {};

    console.log('logout user');

    AuthAPI.logout(this.user).then(function() {
      this.user = null;
      cb();
      this.trigger(null, this.user);
    }.bind(this));
  },

  // TODO: should this be in this store?
  starTrack: function(track, cb) {
    cb = cb || function() {};

    console.log('star track:', track);

    TrackAPI.star(track).then(function(starredTrack) {
      this.user.starredTracks.push(starredTrack);
      cb(null);
      this.trigger(null, this.user);
    }.bind(this)).catch(function(err) {
      cb(err);
    });
  },

  // TODO: should this be in this store?
  unstarTrack: function(track, cb) {
    cb = cb || function() {};

    console.log('unstar track:', track);

    TrackAPI.star(track).then(function() {
      this.user.starredTracks = _.reject(this.user.starredTracks, function(starredTrack) {
        return starredTrack.sourceParam === track.sourceParam && starredTrack.sourceUrl === track.sourceUrl;
      });
      cb(null);
      this.trigger(null, this.user);
    }.bind(this)).catch(function(err) {
      cb(err);
    });
  }

});

module.exports = CurrentTrackStore;