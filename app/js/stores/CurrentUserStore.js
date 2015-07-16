'use strict';

import Reflux       from 'reflux';
import _            from 'lodash';

import UserActions  from '../actions/UserActions';
import TrackActions from '../actions/TrackActions';
import AuthAPI      from '../utils/AuthAPI';
import UserAPI      from '../utils/UserAPI';
import TrackAPI     from '../utils/TrackAPI';

var CurrentTrackStore = Reflux.createStore({

  init() {
    this.user = null;

    this.listenTo(UserActions.check, this.checkLoginStatus);
    this.listenTo(UserActions.login, this.loginUser);
    this.listenTo(UserActions.facebookLogin, this.loginUserFacebook);
    this.listenTo(UserActions.update, this.updateUser);
    this.listenTo(UserActions.logout, this.logoutUser);
    this.listenTo(TrackActions.star, this.starTrack);
    this.listenTo(TrackActions.unstar, this.unstarTrack);
  },

  checkLoginStatus(cb = function() {}) {
    AuthAPI.check().then(user => {
      this.user = user;
      cb(null, this.user);
      this.trigger(null, this.user);
    }).catch(err => {
      cb(err);
      this.trigger(err);
    });
  },

  loginUser(user, cb = function() {}) {
    console.log('login user');

    AuthAPI.login(user).then(user => {
      this.user = user;
      cb(null, this.user);
      this.trigger(null, this.user);
    }).catch(err => {
      cb(err);
      this.trigger(err);
    });
  },

  loginUserFacebook(user, cb = function() {}) {
    console.log('login user via facebook');

    AuthAPI.facebookLogin(user).then(user => {
      this.user = user;
      cb(null, this.user);
      this.trigger(null, this.user);
    }).catch(err => {
      cb(err);
      this.trigger(err);
    });
  },

  updateUser(updates, cb = function() {}) {
    UserAPI.update(this.user.id, updates).then(updatedUser => {
      this.user = updatedUser;
      cb(null, this.user);
      this.trigger(null, this.user);
    }).catch(err => {
      cb(err);
    });
  },

  logoutUser: function(cb = function() {}) {
    console.log('logout user');

    AuthAPI.logout(this.user).then(() => {
      this.user = null;
      cb();
      this.trigger(null, this.user);
    });
  },

  // TODO: should this be in this store?
  starTrack: function(track, cb = function() {}) {
    console.log('star track:', track);

    TrackAPI.star(track).then(starredTrack => {
      this.user.starredTracks.push(starredTrack);
      cb(null);
      this.trigger(null, this.user);
    }).catch(err => {
      cb(err);
    });
  },

  // TODO: should this be in this store?
  unstarTrack: function(track, cb = function() {}) {
    console.log('unstar track:', track);

    TrackAPI.star(track).then(() => {
      this.user.starredTracks = _.reject(this.user.starredTracks, starredTrack => {
        return starredTrack.sourceParam === track.sourceParam && starredTrack.sourceUrl === track.sourceUrl;
      });
      cb(null);
      this.trigger(null, this.user);
    }).catch(err => {
      cb(err);
    });
  }

});

module.exports = CurrentTrackStore;