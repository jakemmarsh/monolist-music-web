'use strict';

import _                from 'lodash';
import qs               from 'querystring';
import {ListenerMixin}  from 'reflux';
import {History}        from 'react-router';

import CurrentUserStore from '../stores/CurrentUserStore';
import LoginPage        from '../pages/LoginPage';

const LoggedInRouteMixin = {

  mixins: [ListenerMixin, History],

  _doLoginRedirect() {
    LoginPage.attemptedTransition = {
      path: window.location.pathname,
      query: qs.parse(window.location.search.replace('?', ''))
    };

    this.history.replaceState(null, '/login');
  },

  _onCurrentUserStoreChange(err, user) {
    if ( err || _.isEmpty(user) ) {
      this._doLoginRedirect();
    }
  },

  componentDidMount() {
    if ( CurrentUserStore.hasChecked && _.isEmpty(CurrentUserStore.user) ) {
      this._doLoginRedirect();
    } else {
      this.listenTo(CurrentUserStore, this._onCurrentUserStoreChange);
    }
  }

};

export default LoggedInRouteMixin;