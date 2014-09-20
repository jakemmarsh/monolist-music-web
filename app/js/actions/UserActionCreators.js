'use strict';

var AppDispatcher = require('./dispatcher/AppDispatcher');
var ActionTypes   = require('./constants/ActionTypes');
var UserAPI       = require('./utils/UserAPI');
var UserStore     = require('./stores/UserStore');

var UserActionCreators = {

  requestUser: function(login, fields) {
    if (UserStore.contains(login, fields)) {
      return;
    }

    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_USER,
      login: login
    });

    UserAPI.requestUser(login);
  }

};

module.exports = UserActionCreators;