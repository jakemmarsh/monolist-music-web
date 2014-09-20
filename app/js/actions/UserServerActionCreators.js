'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes   = require('../constants/ActionTypes');

var UserServerActionCreators = {

  handleUserSuccess: function(response) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_USER_SUCCESS,
      response: response
    });
  },

  handleUserError: function(err) {
    console.log(err);

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_USER_ERROR
    });
  }

};

module.exports = UserServerActionCreators;