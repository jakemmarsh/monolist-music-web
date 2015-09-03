'use strict';

import _                from 'lodash';

import CurrentUserStore from '../stores/CurrentUserStore';

const LoggedOutRouteMixin = {

  statics: {
    willTransitionTo(transition) {
      if ( !_.isEmpty(CurrentUserStore.user) ) {
        transition.redirect('/explore');
      }
    }
  }

};

export default LoggedOutRouteMixin;