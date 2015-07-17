 /* global FB */
'use strict';

import React              from 'react/addons';
import {ListenerMixin}    from 'reflux';
import _                  from 'lodash';
import $                  from 'jquery';
import {Link, Navigation} from 'react-router';
import cx                 from 'classnames';
import DocumentTitle      from 'react-document-title';

import APIUtils           from '../utils/APIUtils';
import AuthAPI            from '../utils/AuthAPI';
import AwsAPI             from '../utils/AwsAPI';
import FileInput          from '../components/FileInput';
import Spinner            from '../components/Spinner';

var RegisterPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, ListenerMixin, Navigation],

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
      loading: false,
      error: null,
      isFacebookRegister: false
    };
  },

  componentDidMount() {
    var component = this;

    $('.register-form input').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    }).blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  componentDidUpdate(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm() {
    var formIsValid = this.state.username.length && this.state.email.length && this.state.password.length && this.state.confirmPassword.length;

    this.setState({ submitDisabled: !formIsValid });
  },

  updateImage(file) {
    this.setState({ image: file });
  },

  createUser() {
    var user = {
      username: this.state.username,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      imageUrl: this.state.imageUrl,
      facebookId: this.state.facebookId,
      password: this.state.password
    };

    return new Promise((resolve, reject) => {
      AuthAPI.register(user).then(createdUser => {
        this.setState({ loading: false });
        resolve(createdUser);
      }).catch(err => {
        this.setState({ error: err.message, loading: false });
        reject(err.message);
      });
    });
  },

  uploadImage(user) {
    return new Promise((reject, resolve) => {
      if ( this.state.image ) {
        AwsAPI.uploadUserImage(this.state.image, user.id).then(() => {
          resolve(user);
        }).catch(err => {
          console.log('error uploading user image:', err);
          // Still resolve since user was successfully created
          resolve(user);
        });
      } else {
        resolve(user);
      }
    });
  },

  checkFbState() {
    FB.getLoginStatus(response => {
      if ( response.status === 'connected' ) {
        console.log('logged in via Facebook!!');
        this.getUserFbInfo();
      } else if ( response.status === 'not_authorized' ) {
        this.setState({ error: 'You must authorize PunditTracker via Facebook to register using that method.' });
      } else {
        this.setState({ error: 'You must be logged in to Facebook to register using that method.' });
      }
    });
  },

  getUserFbInfo() {
    var component = this; // Seemingly can't bind FB api calls to 'this'

    FB.api('/me', { fields: 'email,first_name,last_name,id' }, response => {
      FB.api('/me/picture?width=180&height=180', imageResponse => {
        component.setState({
          email: response.email,
          firstName: response.first_name,
          lastName: response.last_name,
          avatarUrl: imageResponse.data.url,
          facebookId: response.id
        });
      });
    });
  },

  doFbRegister() {
    this.setState({ isFacebookRegister: true }, () => {
      FB.login(this.checkFbState, { scope: 'public_profile,email' });
    });
  },

  handleSubmit(evt) {
    var passwordsMatch = this.state.password === this.state.confirmPassword;

    evt.stopPropagation();
    evt.preventDefault();

    if ( !passwordsMatch ) {
      this.setState({ error: 'Those passwords do not match!' });
    } else {
      this.setState({ error: null, loading: true });

      this.createUser().then(this.uploadImage).then(user => {
        this.transitionTo('Login', {}, { username: user.username });
      }).catch(err => {
        this.setState({ error: err.message });
      });
    }
  },

  renderEmailInput() {
    var element = null;
    var emailLabelClasses = cx({ 'active': this.state.focusedInput === 'email' });

    if ( !this.state.isFacebookRegister ) {
      element = (
        <div className="input-container">
          <label htmlFor="email" className={emailLabelClasses}>Email</label>
          <div className="input">
            <input type="text" id="email" valueLink={this.linkState('email')} placeholder="Email address" required />
          </div>
        </div>
      );
    }

    return element;
  },

  renderImageInput() {
    var element = null;
    var imageLabelClasses = cx({ 'active': this.state.focusedInput === 'image-url' });

    if ( !this.state.isFacebookRegister ) {
      element = (
        <div className="input-container">
          <label htmlFor="image-url" className={imageLabelClasses}>Profile Image</label>
          <div className="input">
            <FileInput id="image-url" accept="image/x-png, image/gif, image/jpeg" processFile={this.updateImage} />
          </div>
        </div>
      );
    }

    return element;
  },

  renderPasswordInput() {
    var element = null;
    var passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });

    if ( !this.state.isFacebookRegister ) {
      element = (
        <div className="input-container">
          <label htmlFor="password" className={passwordLabelClasses}>Password</label>
          <div className="input">
            <input type="password" id="password" valueLink={this.linkState('password')} placeholder="Password" required />
          </div>
        </div>
      );
    }

    return element;
  },

  renderConfirmInput() {
    var element = null;
    var confirmLabelClasses = cx({ 'active': this.state.focusedInput === 'confirm-password' });

    if ( !this.state.isFacebookRegister ) {
      element = (
        <div className="input-container">
          <label htmlFor="confirm-password" className={confirmLabelClasses}>Confirm</label>
          <div className="input">
            <input type="password" id="confirm-password" valueLink={this.linkState('confirmPassword')} placeholder="Confirm Password" required />
          </div>
        </div>
      );
    }

    return element;
  },

  renderError() {
    var element = null;

    if ( this.state.error ) {
      element = (
        <div className="error-container nudge-half--bottom text-center">
          {this.state.error}
        </div>
      );
    }

    return element;
  },

  renderSpinner() {
    var element = null;

    if ( this.state.loading ) {
      element = (
        <div className="spinner-container text-center nudge-half--bottom">
          <Spinner size={10} />
        </div>
      );
    }

    return element;
  },

  renderFacebookOption() {
    return (
      <div>
        <a className="btn full facebook nudge-half--bottom" onClick={this.doFbRegister}>Sign up with Facebook</a>
        <strong className="line-thru">or</strong>
        <h5 className="light text-center nudge-quarter--ends">Sign up with your email address</h5>
      </div>
    );
  },

  render() {
    var usernameLabelClasses = cx({ 'active': this.state.focusedInput === 'username' });

    return (
      <DocumentTitle title={APIUtils.buildPageTitle('Register')}>
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

            {this.renderEmailInput()}

            {this.renderImageInput()}

            {this.renderPasswordInput()}

            {this.renderConfirmInput()}
          </div>

          {this.renderError()}

          {this.renderSpinner()}

          <div className="submit-container">
            <input type="submit" className="btn full" value="Sign Up" disabled={this.state.submitDisabled ? 'true' : ''} />
          </div>
        </form>

        <div className="text-center nudge-half--top">
          Already have an account? <Link to="Login">Log in</Link>
        </div>

      </div>
      </DocumentTitle>
    );
  }

});

export default RegisterPage;