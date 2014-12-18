/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var Reflux        = require('reflux');
var when          = require('when');
var _             = require('lodash');
var $             = require('jquery');
var Navigation    = require('react-router').Navigation;
var Link          = React.createFactory(require('react-router').Link);
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
      email: '',
      image: null,
      password: '',
      confirmPassword: '',
      submitDisabled: true,
      focusedInput: null,
      loading: false,
      error: null
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
    var passwordsMatch = this.state.password === this.state.confirmPassword;

    if ( !passwordsMatch ) {
      this.setState({
        submitDisabled: true,
        error: {
          error: 'Those passwords do not match!'
        }
      });
    } else if ( !formIsValid ) {
      this.setState({ submitDisabled: true });
    } else if ( formIsValid && passwordsMatch ) {
      this.setState({
        submitDisabled: false,
        error: null
      });
    }
  },

  updateImage: function(file) {
    this.setState({ image: file });
  },

  createUser: function() {
    var deferred = when.defer();
    var user = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };

    AuthAPI.register(user).then(function(createdUser) {
      this.setState({ loading: false });
      deferred.resolve(createdUser);
    }.bind(this)).catch(function(err) {
      this.setState({ error: err, loading: false });
    }.bind(this));

    return deferred.promise;
  },

  uploadImage: function(user) {
    var deferred = when.defer();

    if ( this.state.image ) {
      AwsAPI.uploadUserImage(this.state.image, user.id).then(function() {
        deferred.resolve();
      }).catch(function(err) {
        console.log('error uploading user image:', err);
        // Still resolve since user was successfully created
        deferred.resolve();
      });
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  },

  handleSubmit: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    this.setState({ loading: true });

    this.createUser().then(this.uploadImage).then(function() {
      this.transitionTo('Login');
    }.bind(this));
  },

  renderSpinner: function() {
    var element = null;

    if ( this.state.loading ) {
      element = (
        <Spinner size={10} />
      );
    }

    return element;
  },

  render: function() {
    var usernameLabelClasses = cx({ 'active': this.state.focusedInput === 'username' });
    var emailLabelClasses = cx({ 'active': this.state.focusedInput === 'email' });
    var imageLabelClasses = cx({ 'active': this.state.focusedInput === 'image-url' });
    var passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });
    var confirmLabelClasses = cx({ 'active': this.state.focusedInput === 'confirm-password' });

    return (
      <section className="register">

        <DocumentTitle title="Register" />

        <div className="form-container">
          <div className="modal">
            <Link to="Home"><img className="logo" src="../images/logo.png" alt="Monolist logo" /></Link>

            <form id="register-form" className="register-form" encType="multipart/form-data" onSubmit={this.handleSubmit}>

              <div className="input-container">
                <label htmlFor="username" className={usernameLabelClasses}>Username</label>
                <input type="text" id="username" valueLink={this.linkState('username')} placeholder="Username" required />
              </div>

              <div className="input-container">
                <label htmlFor="email" className={emailLabelClasses}>Email</label>
                <input type="text" id="email" valueLink={this.linkState('email')} placeholder="Email address" />
              </div>

              <div className="input-container">
                <label htmlFor="image-url" className={imageLabelClasses}>Profile Image</label>
                <FileInput id="image-url" accept="image/x-png, image/gif, image/jpeg" processFile={this.updateImage} />
              </div>

              <div className="input-container">
                <label htmlFor="password" className={passwordLabelClasses}>Password</label>
                <input type="password" id="password" valueLink={this.linkState('password')} placeholder="Password" required />
              </div>

              <div className="input-container">
                <label htmlFor="confirm-password" className={confirmLabelClasses}>Confirm</label>
                <input type="password" id="confirm-password" valueLink={this.linkState('confirmPassword')} placeholder="Confirm Password" required />
              </div>

              <div className="error-container nudge-half--bottom">
                {this.state.error}
              </div>

              <div className="submit-container">
                {this.renderSpinner()}
                <input type="submit" className="btn" value="Register" disabled={this.state.submitDisabled ? 'true' : ''} />
              </div>

            </form>
          </div>
        </div>

      </section>
    );
  }

});

module.exports = React.createFactory(LoginPage);