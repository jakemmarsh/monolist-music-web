 /* global FB */
'use strict';

import React                  from 'react/addons';
import _                      from 'lodash';
import $                      from 'jquery';
import qs                     from 'querystring';
import slug                   from 'slug';
import cx                     from 'classnames';

import LayeredComponentMixin  from './LayeredComponentMixin';
import FacebookAuthMixin      from './FacebookAuthMixin';
import UserActions            from '../actions/UserActions';
import TimeoutTransitionGroup from '../components/TimeoutTransitionGroup';
import Modal                  from '../components/Modal';
import Spinner                from '../components/Spinner';

var LoginModalMixin = {

  mixins: [LayeredComponentMixin, FacebookAuthMixin()],

  getInitialState() {
    return {
      showLoginModal: false,
      username: '',
      password: '',
      submitDisabled: true,
      focusedInput: null,
      isFacebookLogin: false,
      loading: false,
      error: null
    };
  },

  _onUserChange(err, user) {
    if ( err ) {
      this.setState({
        loading: false,
        error: err.message,
        isFacebookLogin: false
      });
    } else if ( !_.isEmpty(user) ) {
      this.setState({ showLoginModal: false });
    }
  },

  createFocusListeners() {
    let component = this;

    $('.login-form input').focus(function() { component.focusInput($(this).attr('id')); });
    $('.login-form input').blur(function() { component.focusInput(null); });
  },

  toggleLoginModal() {
    this.setState({ showLoginModal: !this.state.showLoginModal }, () => {
      if ( this.state.showLoginModal ) {
        this.createFocusListeners();
      } else {
        this.setState(this.getInitialState());
      }
    });
  },

  componentDidUpdate(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) && this.isMounted() ) {
      this.checkForm();
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

  renderLayer() {
    let element = (<span />);

    if ( this.state.showLoginModal ) {
      element = (
        <Modal className="share" onRequestClose={this.toggleLoginModal}>

          <TimeoutTransitionGroup enterTimeout={500}
                                leaveTimeout={500}
                                transitionName="fade">
            {this.renderFacebookButton()}
          </TimeoutTransitionGroup>

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

        </Modal>
      );
    }

    return element;
  },

};

export default LoginModalMixin;