'use strict';

import _                from 'lodash';
import {ListenerMixin}  from 'reflux';
import {History}        from 'react-router';

import CurrentUserStore from '../stores/CurrentUserStore';

const LoggedOutRouteMixin = {

  mixins: [ListenerMixin, History],

  _doRedirect() {
    this.history.replaceState(null, '/');
  },

  _onCurrentUserStoreChange(err, user) {
    if ( !err && !_.isEmpty(user) ) {
      this._doRedirect();
    }
  },

  componentDidMount() {
    if ( CurrentUserStore.hasChecked && !_.isEmpty(CurrentUserStore.user) ) {
      this._doRedirect();
    } else {
      this.listenTo(CurrentUserStore, this._onCurrentUserStoreChange);
    }
  }

};

export default LoggedOutRouteMixin;