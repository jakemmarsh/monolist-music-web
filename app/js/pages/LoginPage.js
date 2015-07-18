'use strict';

import React              from 'react/addons';
import _                  from 'lodash';
import $                  from 'jquery';
import {Link, Navigation} from 'react-router';
import cx                 from 'classnames';
import DocumentTitle      from 'react-document-title';

import APIUtils           from '../utils/APIUtils';
import FacebookAuthMixin  from '../mixins/FacebookAuthMixin';
import UserActions        from '../actions/UserActions';
import CurrentUserStore   from '../stores/CurrentUserStore';
import Spinner            from '../components/Spinner';

var LoginPage = React.createClass({

  statics: {
    attemptedTransition: null
  },

  mixins: [React.addons.LinkedStateMixin, Navigation, FacebookAuthMixin()],

  getInitialState() {
    return {
      username: this.props.query.username || '',
      password: '',
      submitDisabled: true,
      isFacebookLogin: this.props.query.fb === 'true',
      facebookId: null,
      focusedInput: null,
      loading: false,
      error: null
    };
  },

  _onUserChange(err, user) {
    if ( err ) {
      this.setState({ loading: false, error: err.message });
    } else if ( !_.isEmpty(user) ) {
      this.doRedirect();
    }
  },

  componentDidMount() {
    let component = this;

    if ( !_.isEmpty(CurrentUserStore.user) ) {
      this.doRedirect();
    } else {
      UserActions.check((err, user) => {
        this._onUserChange(null, user);
      });

      $('.login-form input').focus(function() { component.focusInput($(this).attr('id')); });
      $('.login-form input').blur(function() { component.focusInput(null); });
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) && this.isMounted() ) {
      this.checkForm();
    }
  },

  doRedirect() {
    let attemptedTransition;

    if ( this.attemptedTransition ) {
      console.log('has attempt:', this.attemptedTransition);
      attemptedTransition = this.attemptedTransition;
      this.attemptedTransition = null;
      attemptedTransition.retry();
    } else {
      this.replaceWith('Playlists');
    }
  },

  focusInput(inputId) {
    if ( this.isMounted() ) {
      this.setState({ focusedInput: inputId });
    }
  },

  checkForm() {
    let formIsValid = this.state.username.length && this.state.password.length;

    this.setState({ submitDisabled: !formIsValid });
  },

  beginFbLogin() {
    this.setState({ isFacebookLogin: true }, this.doFbLogin);
  },

  handleSubmit(evt) {
    let loginFunction = this.state.isFacebookLogin ? UserActions.facebookLogin : UserActions.login;
    let user;

    if ( evt ) {
      evt.stopPropagation();
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
      }
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

    if ( !hasUsernameOrPassword ) {
      return (
        <div>
          <button className="btn full facebook nudge-half--bottom" onClick={this.beginFbLogin}>
            {text}
          </button>
          {this.renderLoginDivider()}
        </div>
      );
    }
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
          <input type="submit" className="btn full" value="Login" disabled={this.state.submitDisabled ? 'true' : ''} />
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
      <DocumentTitle title={APIUtils.buildPageTitle('Login')}>
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
      </DocumentTitle>
    );
  }

});

export default LoginPage;