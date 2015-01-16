/**
 * @jsx React.DOM
 */
 /* global FB */
'use strict';

var React         = require('react/addons');
var Reflux        = require('reflux');
var when          = require('when');
var _             = require('lodash');
var $             = require('jquery');
var Link          = React.createFactory(require('react-router').Link);
var Navigation    = require('react-router').Navigation;
var cx            = React.addons.classSet;

var DocumentTitle = require('../components/DocumentTitle');
var AuthAPI       = require('../utils/AuthAPI');
var AwsAPI        = require('../utils/AwsAPI');
var FileInput     = require('../components/FileInput');
var Spinner       = require('../components/Spinner');

var LoginPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Reflux.ListenerMixin, Navigation],

  getInitialState: function() {
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

  componentDidMount: function() {
    var component = this;

    $('.register-form input').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    }).blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm: function() {
    var formIsValid = this.state.username.length && this.state.email.length && this.state.password.length && this.state.confirmPassword.length;

    this.setState({ submitDisabled: !formIsValid });
  },

  updateImage: function(file) {
    this.setState({ image: file });
  },

  createUser: function() {
    var deferred = when.defer();
    var user = {
      username: this.state.username,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      imageUrl: this.state.imageUrl,
      facebookId: this.state.facebookId,
      password: this.state.password
    };

    AuthAPI.register(user).then(function(createdUser) {
      this.setState({ loading: false });
      deferred.resolve(createdUser);
    }.bind(this)).catch(function(err) {
      this.setState({ error: err.message, loading: false });
    }.bind(this));

    return deferred.promise;
  },

  uploadImage: function(user) {
    var deferred = when.defer();

    if ( this.state.image ) {
      AwsAPI.uploadUserImage(this.state.image, user.id).then(function() {
        deferred.resolve(user);
      }).catch(function(err) {
        console.log('error uploading user image:', err);
        // Still resolve since user was successfully created
        deferred.resolve(user);
      });
    } else {
      deferred.resolve(user);
    }

    return deferred.promise;
  },

  checkFbState: function() {
    FB.getLoginStatus(function(response) {
      if ( response.status === 'connected' ) {
        console.log('logged in via Facebook!!');
        this.getUserFbInfo();
      } else if ( response.status === 'not_authorized' ) {
        this.setState({ error: 'You must authorize PunditTracker via Facebook to register using that method.' });
      } else {
        this.setState({ error: 'You must be logged in to Facebook to register using that method.' });
      }
    }.bind(this));
  },

  getUserFbInfo: function() {
    var component = this; // Seemingly can't bind FB api calls to 'this'

    FB.api('/me', { fields: 'email,first_name,last_name,id' }, function(response) {
      FB.api('/me/picture?width=180&height=180', function(imageResponse) {
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

  doFbRegister: function() {
    this.setState({ isFacebookRegister: true }, function() {
      FB.login(this.checkFbState, { scope: 'public_profile,email' });
    }.bind(this));
  },

  handleSubmit: function(evt) {
    var passwordsMatch = this.state.password === this.state.confirmPassword;

    evt.stopPropagation();
    evt.preventDefault();

    if ( !passwordsMatch ) {
      this.setState({ error: 'Those passwords do not match!' });
    } else {
      this.setState({ error: null, loading: true });

      this.createUser().then(this.uploadImage).then(function(user) {
        this.transitionTo('Login', {}, { username: user.username });
      }.bind(this)).catch(function(err) {
        this.setState({ error: err.message });
      }.bind(this));
    }
  },

  renderEmailInput: function() {
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

  renderImageInput: function() {
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

  renderPasswordInput: function() {
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

  renderConfirmInput: function() {
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

  renderError: function() {
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

  renderSpinner: function() {
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

  renderFacebookOption: function() {
    return (
      <div>
        <a className="btn full facebook nudge-half--bottom" onClick={this.doFbRegister}>Sign up with Facebook</a>
        <strong className="line-thru">or</strong>
        <h5 className="light text-center nudge-quarter--ends">Sign up with your email address</h5>
      </div>
    );
  },

  render: function() {
    var usernameLabelClasses = cx({ 'active': this.state.focusedInput === 'username' });

    return (
      <div>

        <DocumentTitle title="Register" />

        {/*this.renderFacebookOption()*/}

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
    );
  }

});

module.exports = React.createFactory(LoginPage);