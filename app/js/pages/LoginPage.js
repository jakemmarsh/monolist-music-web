'use strict';

import React               from 'react';
import {History}           from 'react-router';
import _                   from 'lodash';
import DocumentTitle       from 'react-document-title';

import LoggedOutRouteMixin from '../mixins/LoggedOutRouteMixin';
import Helpers             from '../utils/Helpers';
import UserActions         from '../actions/UserActions';
import CurrentUserStore    from '../stores/CurrentUserStore';
import LoginForm           from '../components/LoginForm';

const LoginPage = React.createClass({

  statics: {
    attemptedTransition: null
  },

  mixins: [History, LoggedOutRouteMixin],

  propTypes: {
    location: React.PropTypes.object
  },

  getInitialState() {
    return {
      loading: false,
      error: null
    };
  },

  _onUserChange(err, user) {
    if ( err ) {
      this.setState({ loading: false, error: err });
    } else if ( !_.isEmpty(user) ) {
      this.handleLogin();
    }
  },

  componentDidMount() {
    if ( !_.isEmpty(CurrentUserStore.user) ) {
      this._onUserChange(null, CurrentUserStore.user);
    } else {
      UserActions.check((err, user) => {
        if ( !err ) {
          this._onUserChange(null, user);
        }
      });
    }
  },

  handleLogin() {
    let attemptedTransition; // eslint-disable-line prefer-const

    if ( !_.isEmpty(LoginPage.attemptedTransition) ) {
      attemptedTransition = LoginPage.attemptedTransition;
      LoginPage.attemptedTransition = null;
      this.history.replaceState(null, attemptedTransition.path, attemptedTransition.query);
    } else {
      this.history.replaceState(null, '/');
    }
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Login')}>
      <div>

        <LoginForm onLogin={this.handleLogin}
                   isFacebookLogin={this.props.location.query.fb === 'true'} />

      </div>
      </DocumentTitle>
    );
  }

});

export default LoginPage;
