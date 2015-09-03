'use strict';

import _                from 'lodash';

import CurrentUserStore from '../stores/CurrentUserStore';
import LoginPage        from '../pages/LoginPage';

const AuthenticatedRouteMixin = {

  statics: {
    willTransitionTo(transition) {
      if ( _.isEmpty(CurrentUserStore.user) ) {
        LoginPage.attemptedTransition = transition;
        transition.redirect('/login');
      }
    }
  }

};

export default AuthenticatedRouteMixin;