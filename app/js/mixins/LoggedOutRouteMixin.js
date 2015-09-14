'use strict';

import _                from 'lodash';
import {History}        from 'react-router';

import CurrentUserStore from '../stores/CurrentUserStore';

const LoggedOutRouteMixin = {

  mixins: [History],

  _onCurrentUserStoreChange(err, user) {
    if ( !err && !_.isEmpty(user) ) {
      this.history.replaceState(null, '/');
    }
  },

  componentDidMount() {
    if ( CurrentUserStore.hasChecked && !_.isEmpty(CurrentUserStore.user) ) {
      this.history.replaceState(null, '/');
    } else {
      this.listenTo(CurrentUserStore, this._onCurrentUserStoreChange);
    }
  }

};

export default LoggedOutRouteMixin;