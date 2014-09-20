'use strict';

var StoreUtils = require('./utils/StoreUtils');

// TODO: Logic might be different since we don't have multiple users at a time?
var _users = {};

var UserStore = StoreUtils.createStore({

  get: function(login) {
    return _users[login];
  }

});

module.exports = UserStore;