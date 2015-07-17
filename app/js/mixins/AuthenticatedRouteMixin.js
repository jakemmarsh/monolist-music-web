'use strict';

import CurrentUserStore from '../stores/CurrentUserStore';
import LoginPage        from '../pages/LoginPage';

var AuthenticatedRouteMixin = {

  statics: {
    willTransitionTo(transition) {
      console.log('will transition. current user:', CurrentUserStore.user);
      if ( !CurrentUserStore.user ) {
        LoginPage.attemptedTransition = transition;
        transition.redirect('/login');
      }
    }
  }

};

export default AuthenticatedRouteMixin;