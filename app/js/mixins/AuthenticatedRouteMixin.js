'use strict';

var CurrentUserStore = require('../stores/CurrentUserStore');
var LoginPage        = require('../pages/LoginPage');

var AuthenticatedRouteMixin = {

  statics: {
    willTransitionTo: function (transition) {
      console.log('will transition. current user:', CurrentUserStore.user);
      if ( !CurrentUserStore.user ) {
        LoginPage.attemptedTransition = transition;
        transition.redirect('/login');
      }
    }
  }

};

module.exports = AuthenticatedRouteMixin;