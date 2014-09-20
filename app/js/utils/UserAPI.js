'use strict';

var UserServerActionCreators = require('./actions/UserServerActionCreators');
var APIUtils                 = require('./APIUtils');

var UserAPI = {

  requestUser: function(username) {
    var response;

    APIUtils.request('users/' + username).end(function (res) {
      if ( !res.ok ) {
        UserServerActionCreators.handleUserError(res.text);
      } else {
        response = APIUtils.normalizeUserResponse(res);
        UserServerActionCreators.handleUserSuccess(response);
      }
    });
  }

};

module.exports = UserAPI;