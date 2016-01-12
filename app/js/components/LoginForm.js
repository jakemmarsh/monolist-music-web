'use strict';

import React             from 'react';
import LinkedStateMixin  from 'react-addons-linked-state-mixin';
import cx                from 'classnames';
import $                 from 'jquery';
import _                 from 'lodash';

import FacebookAuthMixin from '../mixins/FacebookAuthMixin';
import UserActions       from '../actions/UserActions';
import Spinner           from './Spinner';

var LoginForm = React.createClass({

  mixins: [LinkedStateMixin, FacebookAuthMixin()],

  propTypes: {
    onLogin: React.PropTypes.func,
    isFacebookLogin: React.PropTypes.bool
  },

  getInitialState() {
    return {
      username: '',
      password: '',
      isFacebookLogin: this.props.isFacebookLogin || false,
      focusedInput: null,
      loading: false,
      error: null
    };
  },

  _createFocusListeners() {
    let component = this;

    $('.login-form input').focus(function() { component.focusInput($(this).attr('id')); });
    $('.login-form input').blur(function() { component.focusInput(null); });
  },

  isFormInvalid() {
    return !this.state.username.length || !this.state.password.length;
  },

  _onUserChange(err, user) {
    if ( err ) {
      this.setState({
        loading: false,
        error: err,
        isFacebookLogin: false
      });
    } else if ( !_.isEmpty(user) ) {
      this.props.onLogin(user);
    }
  },

  componentDidMount() {
    this._createFocusListeners();

    if ( this.state.isFacebookLogin ) {
      this.doFbLogin();
    }
  },

  focusInput(inputId) {
    if ( this.isMounted() ) {
      this.setState({ focusedInput: inputId });
    }
  },

  beginFbLogin() {
    this.setState({ isFacebookLogin: true }, this.doFbLogin);
  },

  handleSubmit(evt) {
    let loginFunction = this.state.isFacebookLogin ? UserActions.facebookLogin : UserActions.login;
    let user;

    if ( evt ) {
      evt.preventDefault();
    }

    if ( !this.state.isFacebookLogin && !!this.state.password.length ) {
      user = {
        username: this.state.username,
        password: this.state.password
      };
    } else if ( this.state.isFacebookLogin ) {
      user = {
        access_token: this.state.accessToken,
        refresh_token: null,
        profile: this.state.facebookProfile
      };
    }

    this.setState({
      error: null,
      loading: true
    }, loginFunction.bind(null, user, this._onUserChange));
  },

  renderLoginDivider() {
    let hasUsernameOrPassword = this.state.username.length || this.state.password.length;

    if ( !hasUsernameOrPassword && !this.state.isFacebookLogin ) {
      return (
        <strong className="line-thru">or</strong>
      );
    }
  },

  renderFacebookButton() {
    let hasUsernameOrPassword = this.state.username.length || this.state.password.length;
    let text = this.state.isFacebookLogin ? 'Logging in with Facebook...' : 'Log in with Facebook';
    let classes = cx({
      'animate-height': true,
      'animate-height-hidden': hasUsernameOrPassword
    });

    return (
      <div className={classes}>
        <div>
          <button className="btn full facebook nudge-half--bottom" onClick={this.beginFbLogin}>
            <i className="icon-facebook nudge-half--right" />
            {text}
          </button>
          {this.renderLoginDivider()}
        </div>
      </div>
    );
  },

  renderUsernamePasswordInputs() {
    let hasUsernameOrPassword = this.state.username.length || this.state.password.length;
    let usernameLabelClasses = cx({ 'active': this.state.focusedInput === 'username' });
    let passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });

    if ( !this.state.isFacebookLogin || hasUsernameOrPassword ) {
      return (
        <div className="table-container">
          <div className="input-container">
            <label htmlFor="username" className={usernameLabelClasses}>Username</label>
            <div className="input">
              <input type="text" id="username" valueLink={this.linkState('username')} placeholder="Username" required />
            </div>
          </div>

          <div className="input-container">
            <label htmlFor="password" className={passwordLabelClasses}>Password</label>
            <div className="input">
              <input type="password" id="password" valueLink={this.linkState('password')} placeholder="Password" required />
            </div>
          </div>
        </div>
      );
    }
  },

  renderError() {
    if ( this.state.error ) {
      return (
        <div className="error-container nudge-half--bottom text-center">
          {this.state.error}
        </div>
      );
    }
  },

  renderSpinner() {
    if ( this.state.loading ) {
      return (
        <div className="spinner-container text-center nudge-half--bottom">
          <Spinner size={10} />
        </div>
      );
    }
  },

  renderLoginButton() {
    let hasUsernameOrPassword = this.state.username.length || this.state.password.length;

    if ( hasUsernameOrPassword || !this.state.isFacebookLogin ) {
      return (
        <div className="submit-container">
          <input type="submit" className="btn full" value="Login" disabled={this.state.loading || this.isFormInvalid() ? 'true' : ''} />
        </div>
      );
    }
  },

  renderForgetLink() {
    let hasUsernameOrPassword = this.state.username.length || this.state.password.length;

    if ( hasUsernameOrPassword || !this.state.isFacebookLogin ) {
      return (
        <div className="text-center nudge-half--top">
          <a href="/forgot">Forget your password?</a>
        </div>
      );
    }
  },

  render() {
    return (
      <div>

        {this.renderFacebookButton()}

        <form className="login-form full-page" onSubmit={this.handleSubmit}>
          {this.renderUsernamePasswordInputs()}

          {this.renderError()}

          {this.renderSpinner()}

          {this.renderLoginButton()}
        </form>

        {this.renderForgetLink()}

        <div className="text-center nudge-quarter--top">
          Don't have an account? <a href="/register">Sign up</a>
        </div>

      </div>
    );
  }

});

export default LoginForm;