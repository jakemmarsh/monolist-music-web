 /* global FB */
'use strict';

import React                 from 'react/addons';
import _                     from 'lodash';
import $                     from 'jquery';
import qs                    from 'querystring';
import slug                  from 'slug';
import cx                    from 'classnames';

import LayeredComponentMixin from './LayeredComponentMixin';
import UserActions           from '../actions/UserActions';
import Modal                 from '../components/Modal';
import Spinner               from '../components/Spinner';

var LoginModalMixin = {

  mixins: [LayeredComponentMixin],

  getInitialState() {
    return {
      showLoginModal: false,
      username: '',
      password: '',
      submitDisabled: true,
      isFacebookLogin: false,
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

  checkFbState() {
    FB.getLoginStatus(response => {
      if ( response.status === 'connected' ) {
        console.log('logged in via Facebook!!');
        this.getUserFbInfo();
      } else if ( response.status === 'not_authorized' ) {
        this.setState({ error: 'You must authorize Monolist via Facebook to log in using that method.' });
      } else {
        this.setState({ error: 'You must be logged in to Facebook to log in using that method.' });
      }
    });
  },

  getUserFbInfo() {
    FB.api('/me', { fields: 'id' }, response => {
      this.setState({ facebookId: response.id }, this.handleSubmit);
    });
  },

  doFbLogin() {
    this.setState({ isFacebookLogin: true });
    FB.login(this.checkFbState, { scope: 'public_profile,email' });
  },

  handleSubmit(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    let user = {
      username: this.state.username
    };
    let loginFunction = this.state.isFacebookLogin ? UserActions.facebookLogin : UserActions.login;

    if ( !this.state.isFacebookLogin && !!this.state.password.length ) {
      user.password = this.state.password;
    } else if ( this.state.isFacebookLogin && this.state.facebookId ) {
      user.facebookId = this.state.facebookId;
    }

    this.setState({ error: null, loading: true }, loginFunction.bind(null, user, this._onUserChange));
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

  renderLayer() {
    let usernameLabelClasses = cx({ 'active': this.state.focusedInput === 'username' });
    let passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });
    let element = (<span />);

    if ( this.state.showLoginModal ) {
      element = (
        <Modal className="share" onRequestClose={this.toggleLoginModal}>

          <div>
            <a className="btn full facebook nudge-half--bottom" onClick={this.doFbLogin}>Log in with Facebook</a>
            <strong className="line-thru">or</strong>
          </div>

          <form className="login-form full-page" onSubmit={this.handleSubmit}>
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

            {this.renderError()}

            {this.renderSpinner()}

            <div className="submit-container">
              <input type="submit" className="btn full" value="Login" disabled={this.state.submitDisabled ? 'true' : ''} />
            </div>
          </form>

          <div className="text-center nudge-half--top">
            <a href="/forgot">Forgot your password?</a>
          </div>

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