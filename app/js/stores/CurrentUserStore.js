'use strict';

import Reflux        from 'reflux';
import _             from 'lodash';

import UserActions   from '../actions/UserActions';
import TrackActions  from '../actions/TrackActions';
import GlobalActions from '../actions/GlobalActions';
import AuthAPI       from '../utils/AuthAPI';
import UserAPI       from '../utils/UserAPI';
import TrackAPI      from '../utils/TrackAPI';

const CurrentUserStore = Reflux.createStore({

  init() {
    this.user = {};
    this.hasChecked = false;

    this.listenTo(UserActions.check, this.checkLoginStatus);
    this.listenTo(UserActions.login, this.loginUser);
    this.listenTo(UserActions.facebookLogin, this.loginUserFacebook);
    this.listenTo(UserActions.update, this.updateUser);
    this.listenTo(UserActions.logout, this.logoutUser);
    this.listenTo(TrackActions.star, this.starTrack);
    this.listenTo(TrackActions.unstar, this.unstarTrack);
  },

  setUser(user, cb = function() {}) {
    this.user = user;
    cb(null, this.user);
    this.trigger(null, user);
  },

  checkLoginStatus(cb = function() {}) {
    AuthAPI.check().then(user => {
      this.hasChecked = true;
      this.setUser(user, cb);
    }).catch(err => {
      cb(err);
      this.trigger(err);
    });
  },

  loginUser(user, cb = function() {}) {
    AuthAPI.login(user).then((loggedInUser) => {
      this.setUser(loggedInUser, cb);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  },

  loginUserFacebook(user, cb = function() {}) {
    AuthAPI.facebookLogin(user).then((loggedInUser) => {
      this.setUser(loggedInUser, cb);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  },

  updateUser(updates, cb = function() {}) {
    UserAPI.update(this.user.id, updates).then((updatedUser) => {
      this.setUser(updatedUser, cb);
    }).catch((err) => {
      cb(err);
    });
  },

  logoutUser(cb = function() {}) {
    AuthAPI.logout(this.user).then(() => {
      this.setUser({}, cb);
    });
  },

  starTrack(track, cb = function() {}) {
    TrackAPI.star(track).then((starredTrack) => {
      this.user.starredTracks.push(starredTrack);

      GlobalActions.triggerSuccessIndicator();

      this.setUser(this.user, cb);
    }).catch((err) => {
      cb(err);
    });
  },

  unstarTrack(track, cb = function() {}) {
    TrackAPI.star(track).then(() => {
      this.user.starredTracks = _.reject(this.user.starredTracks, starredTrack => {
        return starredTrack.sourceParam === track.sourceParam && starredTrack.sourceUrl === track.sourceUrl;
      });

      GlobalActions.triggerSuccessIndicator();

      this.setUser(this.user, cb);
    }).catch(err => {
      cb(err);
    });
  }

});

export default CurrentUserStore;