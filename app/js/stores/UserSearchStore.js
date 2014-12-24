'use strict';

var Reflux      = require('reflux');

var UserActions = require('../actions/UserActions');
var SearchAPI   = require('../utils/SearchAPI');

var UserSearchStore = Reflux.createStore({

  init: function() {
    this.user = null;

    this.listenTo(UserActions.search, this.doSearch);
  },

  doSearch: function(query, cb) {
    cb = cb || function() {};

    console.log('do user search:', query);

    SearchAPI.userSearch(query).then(function(users) {
      cb(null, users);
      this.users = users;
      this.trigger(null, users);
    }.bind(this)).catch(function(err) {
      console.log('error doing user search:', err);
      cb(err);
      this.trigger(err);
    }.bind(this));
  }

});

module.exports = UserSearchStore;