'use strict';

var UserServerActionCreators = require('./actions/UserServerActionCreators');
var APIUtils                 = require('./APIUtils');

var UserAPI = {

  requestUser: function(login) {
    var response;

    APIUtils.request('users/' + login).end(function (res) {
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