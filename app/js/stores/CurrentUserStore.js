'use strict';

var Reflux      = require('reflux');

var UserActions = require('../actions/UserActions');
var UserAPI     = require('../utils/UserAPI');

var CurrentTrackStore = Reflux.createStore({

  init: function() {
    this.listenTo(UserActions.login, this.loginUser);
  },

  loginUser: function(username, password, cb) {
    cb = cb || function() {};

    console.log('login user');

    UserAPI.login(username, password).then(function(user) {
      this.user = user;
      this.trigger(user);
      cb(user);
    }.bind(this));
  }

});

module.exports = CurrentTrackStore;