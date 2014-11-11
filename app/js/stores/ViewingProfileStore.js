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
      this.trigger(profile);
      cb(profile);
    }.bind(this));
  }

});

module.exports = ViewingProfileStore;