'use strict';

import React               from 'react';
import cx                  from 'classnames';
import _                   from 'lodash';

import LabelHighlightMixin from '../mixins/LabelHighlightMixin';
import FacebookAuthMixin   from '../mixins/FacebookAuthMixin';
import UserActions         from '../actions/UserActions';
import Spinner             from './Spinner';

const LoginForm = React.createClass({

  mixins: [FacebookAuthMixin(), LabelHighlightMixin],

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

  handleUsernameChange(evt) {
    this.setState({
      username: evt.target.value
    });
  },

  handlePasswordChange(evt) {
    this.setState({
      password: evt.target.value
    });
  },

  handleSubmit(evt) {
    const loginFunction = this.state.isFacebookLogin ? UserActions.facebookLogin : UserActions.login;
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
        access_token: this.state.accessToken, //eslint-disable-line camelcase
        refresh_token: null, //eslint-disable-line camelcase
        profile: this.state.facebookProfile
      };
    }

    this.setState({
      error: null,
      loading: true
    }, () => {
      loginFunction(user, this._onUserChange);
    });
  },

  renderLoginDivider() {
    const hasUsernameOrPassword = this.state.username.length || this.state.password.length;

    if ( !hasUsernameOrPassword && !this.state.isFacebookLogin ) {
      return (
        <strong className="line-thru">or</strong>
      );
    }
  },

  renderFacebookButton() {
    const hasUsernameOrPassword = this.state.username.length || this.state.password.length;
    const text = this.state.isFacebookLogin ? 'Logging in with Facebook...' : 'Log in with Facebook';
    const classes = cx({
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
    const hasUsernameOrPassword = this.state.username.length || this.state.password.length;
    const usernameLabelClasses = cx({ 'active': this.state.focusedInput === 'username' });
    const passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });

    if ( !this.state.isFacebookLogin || hasUsernameOrPassword ) {
      return (
        <div className="table-container">
          <div className="input-container">
            <label htmlFor="username" className={usernameLabelClasses}>Username</label>
            <div className="input">
              <input type="text"
                     id="username"
                     value={this.state.username}
                     onChange={this.handleUsernameChange}
                     placeholder="Username"
                     required />
            </div>
          </div>

          <div className="input-container">
            <label htmlFor="password" className={passwordLabelClasses}>Password</label>
            <div className="input">
              <input type="password"
                     id="password"
                     value={this.state.password}
                     onChange={this.handlePasswordChange}
                     placeholder="Password"
                     required />
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
    const hasUsernameOrPassword = this.state.username.length || this.state.password.length;

    if ( hasUsernameOrPassword || !this.state.isFacebookLogin ) {
      return (
        <div className="submit-container">
          <input type="submit" className="btn full" value="Login" disabled={this.state.loading || this.isFormInvalid()} />
        </div>
      );
    }
  },

  renderForgetLink() {
    const hasUsernameOrPassword = this.state.username.length || this.state.password.length;

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
