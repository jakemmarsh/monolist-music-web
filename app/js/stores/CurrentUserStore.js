'use strict';

var Reflux      = require('reflux');

var UserActions = require('../actions/UserActions');
var AuthAPI     = require('../utils/AuthAPI');
var UserAPI     = require('../utils/UserAPI');

var CurrentTrackStore = Reflux.createStore({

  init: function() {
    this.user = null;

    this.listenTo(UserActions.check, this.checkLoginStatus);
    this.listenTo(UserActions.login, this.loginUser);
    this.listenTo(UserActions.logout, this.logoutUser);
  },

  checkLoginStatus: function(cb) {
    cb = cb || function() {};

    AuthAPI.check().then(function(user) {
      cb(null, user);
      this.user = user;
      this.trigger(user);
    }.bind(this)).catch(function(err) {
      console.log('error checking login status:', err);
      this.trigger(null);
    }.bind(this));
  },

  loginUser: function(user, cb) {
    cb = cb || function() {};

    console.log('login user');

    AuthAPI.login(user).then(function(user) {

      console.log('login:', user);
      this.user = user;
      cb(null, this.user);
      this.trigger(user);
    }.bind(this)).catch(function(err) {
      cb(err);
      this.trigger(null);
    }.bind(this));
  },

  updateUser: function(updates, cb) {
    cb = cb || function() {};

    UserAPI.update(this.user.id, updates).then(function(updatedUser) {
      this.user = updatedUser;
      cb(null, this.user);
      this.trigger(this.user);
    }).catch(function(err) {
      cb(err);
    });
  },

  logoutUser: function(cb) {
    cb = cb || function() {};

    console.log('logout user');

    AuthAPI.logout(this.user).then(function() {
      this.user = null;
      cb();
      this.trigger(this.user);
    }.bind(this));
  }

});

module.exports = CurrentTrackStore;