 /* global FB */
'use strict';

import React                  from 'react/addons';
import {ListenerMixin}        from 'reflux';
import _                      from 'lodash';
import $                      from 'jquery';
import {Link, Navigation}     from 'react-router';
import cx                     from 'classnames';
import DocumentTitle          from 'react-document-title';

import Helpers                from '../utils/Helpers';
import AuthAPI                from '../utils/AuthAPI';
import AwsAPI                 from '../utils/AwsAPI';
import TimeoutTransitionGroup from '../components/TimeoutTransitionGroup';
import FileInput              from '../components/FileInput';
import Spinner                from '../components/Spinner';

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
    let component = this;

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
    let hasPassword = this.state.password.length && this.state.confirmPassword.length;
    let formIsValid = this.state.username.length && this.state.email.length && (this.state.isFacebookRegister || hasPassword);

    this.setState({ submitDisabled: !formIsValid });
  },

  updateImage(file) {
    this.setState({ image: file });
  },

  createUser() {
    let user = {
      username: this.state.username,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      imageUrl: this.state.imageUrl,
      facebookId: this.state.isFacebookRegister ? this.state.facebookId : null,
      password: this.state.isFacebookRegister ? null : this.state.password
    };

    return new Promise((resolve, reject) => {
      AuthAPI.register(user).then(createdUser => {
        this.setState({ loading: false });
        resolve(createdUser);
      }).catch(err => {
        reject(err);
      });
    });
  },

  uploadImage(user) {
    return new Promise((resolve, reject) => {
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
      console.log('status after checking FB login:', response);
      if ( response.status === 'connected' ) {
        console.log('logged in via Facebook!!');
        this.setState({ facebookId: response.authResponse.userID }, this.getUserFbInfo);
      } else if ( response.status === 'not_authorized' ) {
        this.setState({ error: 'You must authorize Monolist via Facebook to register using that method.' });
      } else {
        this.setState({ error: 'You must be logged in to Facebook to register using that method.' });
      }
    });
  },

  getUserFbInfo() {
    let component = this; // Seemingly can't bind FB api calls to 'this'

    FB.api('/me', { fields: 'email,first_name,last_name,picture.height(180).width(180)' }, response => {
      component.setState({
        email: response.email,
        firstName: response.first_name,
        lastName: response.last_name,
        avatarUrl: response.picture.data.url
      });
    });
  },

  doFbRegister() {
    this.setState({ isFacebookRegister: true }, () => {
      FB.login(this.checkFbState, { scope: 'public_profile,email' });
    });
  },

  handleSubmit(evt) {
    let passwordsMatch = this.state.password === this.state.confirmPassword;
    let queryParams = {};

    if ( evt ) {
      evt.stopPropagation();
      evt.preventDefault();
    }

    if ( !passwordsMatch ) {
      this.setState({ error: 'Those passwords do not match!' });
    } else {
      this.setState({ error: null, loading: true });

      this.createUser().then(this.uploadImage).then(user => {
        if ( this.state.isFacebookRegister ) {
          queryParams.fb = 'true';
        } else {
          queryParams.username = user.username;
        }

        this.transitionTo('Login', {}, queryParams);
      }).catch(err => {
        console.log('error:', err.message);
        this.setState({ error: err.message, loading: false });
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
    let imageLabelClasses = cx({ 'active': this.state.focusedInput === 'image-url' });

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
    let passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });

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
    let confirmLabelClasses = cx({ 'active': this.state.focusedInput === 'confirm-password' });

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
      return(
        <div className="spinner-container text-center nudge-half--bottom">
          <Spinner size={10} />
        </div>
      );
    }
  },

  renderFacebookOption() {
    let text = this.state.isFacebookRegister ? 'Signing up with Facebook...' : 'Sign up with Facebook';

    return (
      <div>
        <button className="btn full facebook nudge-half--bottom"
                onClick={this.doFbRegister}
                disabled={this.state.isFacebookRegister ? 'true' : ''}>
          <i className="fa fa-facebook nudge-half--right" />
          {text}
        </button>
        {this.renderLoginDivider()}
      </div>
    );
  },

  render() {
    let usernameLabelClasses = cx({ 'active': this.state.focusedInput === 'username' });
    let emailLabelClasses = cx({ 'active': this.state.focusedInput === 'email' });

    return (
      <DocumentTitle title={Helpers.buildPageTitle('Register')}>
      <div>

        <TimeoutTransitionGroup enterTimeout={500}
                                leaveTimeout={500}
                                transitionName="fade">
          {this.renderFacebookOption()}
        </TimeoutTransitionGroup>

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