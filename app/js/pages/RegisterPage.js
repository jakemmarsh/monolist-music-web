 /* global FB */
'use strict';

import React               from 'react';
import LinkedStateMixin    from 'react-addons-linked-state-mixin';
import $                   from 'jquery';
import {Link, History}     from 'react-router';
import cx                  from 'classnames';
import DocumentTitle       from 'react-document-title';

import LoggedOutRouteMixin from '../mixins/LoggedOutRouteMixin';
import CurrentUserStore    from '../stores/CurrentUserStore';
import Helpers             from '../utils/Helpers';
import AuthAPI             from '../utils/AuthAPI';
import AwsAPI              from '../utils/AwsAPI';
import Mixpanel            from '../utils/Mixpanel';
import FileInput           from '../components/FileInput';
import Spinner             from '../components/Spinner';

const RegisterPage = React.createClass({

  mixins: [LoggedOutRouteMixin, LinkedStateMixin, History],

  getInitialState() {
    return {
      username: '',
      firstName: null,
      lastName: null,
      email: '',
      image: null,
      password: '',
      confirmPassword: '',
      submitDisabled: true,
      focusedInput: null,
      imageUrl: null,
      facebookId: null,
      accessToken: null,
      loading: false,
      error: null,
      isFacebookRegister: false
    };
  },

  componentDidMount() {
    const component = this;

    $('.register-form input').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    }).blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  isFormInvalid() {
    const hasPassword = this.state.password.length && this.state.confirmPassword.length;
    const formIsValid = this.state.username.length && this.state.email.length && (this.state.isFacebookRegister || hasPassword);

    return !formIsValid;
  },

  updateImage(file) {
    this.setState({ image: file });
  },

  createUser() {
    const user = {
      username: this.state.username,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      imageUrl: this.state.imageUrl,
      facebookId: this.state.isFacebookRegister ? this.state.facebookId : null,
      access_token: this.state.isFacebookRegister ? this.state.accessToken : null, //eslint-disable-line camelcase
      password: this.state.isFacebookRegister ? null : this.state.password
    };

    return new Promise((resolve, reject) => {
      AuthAPI.register(user).then(createdUser => {
        resolve(createdUser);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  uploadImage(user) {
    return new Promise((resolve) => {
      if ( this.state.image ) {
        AwsAPI.uploadUserImage(this.state.image, user.id).then((updatedUser) => {
          resolve(updatedUser);
        }).catch(() => {
          // Still resolve since user was successfully created
          resolve(user);
        });
      } else {
        resolve(user);
      }
    });
  },

  checkFbState() {
    FB.getLoginStatus((response) => {
      if ( response.status === 'connected' ) {
        this.setState({
          facebookId: response.authResponse.userID,
          accessToken: response.authResponse.accessToken
        }, this.getUserFbInfo);
      } else if ( response.status === 'not_authorized' ) {
        this.setState({ error: 'You must authorize Monolist via Facebook to register using that method.' });
      } else {
        this.setState({ error: 'You must be logged in to Facebook to register using that method.' });
      }
    });
  },

  getUserFbInfo() {
    const component = this; // Seemingly can't bind FB api calls to 'this'

    FB.api('/me', { fields: 'email,first_name,last_name,picture.height(180).width(180)' }, response => {
      component.setState({
        username: response.email.split('@')[0],
        email: response.email,
        firstName: response.first_name,
        lastName: response.last_name,
        imageUrl: response.picture.data.url
      });
    });
  },

  doFbRegister() {
    this.setState({ isFacebookRegister: true }, () => {
      FB.login(this.checkFbState, { scope: 'public_profile,email' });
    });
  },

  handleSubmit(evt) {
    const passwordsMatch = this.state.password === this.state.confirmPassword;

    if ( evt ) {
      evt.stopPropagation();
      evt.preventDefault();
    }

    if ( !passwordsMatch ) {
      this.setState({ error: 'Those passwords do not match!' });
    } else {
      this.setState({ error: null, loading: true });

      this.createUser().then(this.uploadImage).then((user) => {
        CurrentUserStore.setUser(user, () => {
          Mixpanel.logEvent('register', user);
          this.history.pushState(null, '/explore');
        });
      }).catch((err) => {
        this.setState({ error: err, loading: false });
      });
    }
  },

  renderLoginDivider() {
    if ( !this.state.isFacebookRegister ) {
      return (
        <div>
          <strong className="line-thru">or</strong>
          <h5 className="light text-center nudge-quarter--ends">Sign up with your email address</h5>
        </div>
      );
    }
  },

  renderImageInput() {
    const imageLabelClasses = cx({ 'active': this.state.focusedInput === 'image-url' });

    if ( !this.state.isFacebookRegister ) {
      return (
        <div className="input-container">
          <label htmlFor="image-url" className={imageLabelClasses}>Profile Image</label>
          <div className="input">
            <FileInput id="image-url" accept="image/x-png, image/gif, image/jpeg" processFile={this.updateImage} />
          </div>
        </div>
      );
    }
  },

  renderPasswordInput() {
    const passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });

    if ( !this.state.isFacebookRegister ) {
      return (
        <div className="input-container">
          <label htmlFor="password" className={passwordLabelClasses}>Password</label>
          <div className="input">
            <input type="password" id="password" valueLink={this.linkState('password')} placeholder="Password" required />
          </div>
        </div>
      );
    }
  },

  renderConfirmInput() {
    const confirmLabelClasses = cx({ 'active': this.state.focusedInput === 'confirm-password' });

    if ( !this.state.isFacebookRegister ) {
      return (
        <div className="input-container">
          <label htmlFor="confirm-password" className={confirmLabelClasses}>Confirm</label>
          <div className="input">
            <input type="password" id="confirm-password" valueLink={this.linkState('confirmPassword')} placeholder="Confirm Password" required />
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

  renderFacebookOption() {
    const text = this.state.isFacebookRegister ? 'Signing up with Facebook...' : 'Sign up with Facebook';

    return (
      <div>
          <button className="btn full facebook nudge-half--bottom"
                  onClick={this.doFbRegister}
                  disabled={this.state.isFacebookRegister ? 'true' : ''}>
            <i className="icon-facebook nudge-half--right" />
            {text}
          </button>
          {this.renderLoginDivider()}
      </div>
    );
  },

  render() {
    const usernameLabelClasses = cx({ 'active': this.state.focusedInput === 'username' });
    const emailLabelClasses = cx({ 'active': this.state.focusedInput === 'email' });

    return (
      <DocumentTitle title={Helpers.buildPageTitle('Register')}>
      <div>

        {this.renderFacebookOption()}

        <form id="register-form" className="register-form full-page" encType="multipart/form-data" onSubmit={this.handleSubmit}>
          <div className="table-container">
            <div className="input-container">
              <label htmlFor="username" className={usernameLabelClasses}>Username</label>
              <div className="input">
                <input type="text" id="username" valueLink={this.linkState('username')} placeholder="Username" required />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="email" className={emailLabelClasses}>Email</label>
              <div className="input">
                <input type="text" id="email" valueLink={this.linkState('email')} placeholder="Email address" required />
              </div>
            </div>

            {this.renderImageInput()}

            {this.renderPasswordInput()}

            {this.renderConfirmInput()}
          </div>

          {this.renderError()}

          {this.renderSpinner()}

          <div className="submit-container">
            <input type="submit" className="btn full" value="Sign Up" disabled={this.state.loading || this.isFormInvalid() ? 'true' : ''} />
          </div>
        </form>

        <div className="text-center nudge-half--top">
          Already have an account? <Link to="/login">Log in</Link>
        </div>

      </div>
      </DocumentTitle>
    );
  }

});

export default RegisterPage;