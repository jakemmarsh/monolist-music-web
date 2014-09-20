'use strict';

var AppDispatcher = require('./dispatcher/AppDispatcher');
var StoreUtils    = require('./utils/StoreUtils');

// TODO: Logic might be different since we don't have multiple users at a time?
var _users = {};

var UserStore = StoreUtils.createStore({

  get: function(login) {
    return _users[login];
  }

});

UserStore.dispatchToken = AppDispatcher.register(function(payload) {

  var action   = payload.action;
  var response = action.response;

  if ( response ) {
    // TODO: what to do with response?
    StoreUtils.mergeIntoBag(_users, response);
    UserStore.emitChange();
  }

});

module.exports = UserStore;