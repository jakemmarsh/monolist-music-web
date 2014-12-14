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

var DocumentTitle = require('../components/DocumentTitle');
var AuthAPI       = require('../utils/AuthAPI');
var AwsAPI        = require('../utils/AwsAPI');
var FileInput     = require('../components/FileInput');

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
      error: {
        error: null
      }
    };
  },

  componentDidUpdate: function(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm: function() {
    var $form = $('#register-form');
    var formValidity = !$form.checkValidity || $form.checkValidity();
    var passwordsMatch = this.state.password === this.state.confirmPassword;

    if ( !passwordsMatch ) {
      this.setState({
        submitDisabled: true,
        error: {
          error: 'Those passwords do not match!'
        }
      });
    } else if ( !formValidity ) {
      this.setState({ submitDisabled: true });
    } else if ( formValidity && passwordsMatch ) {
      this.setState({
        submitDisabled: false,
        error: {
          error: null
        }
      });
    }
  },

  updateImage: function(file) {
    this.setState({ image: file });
  },

  createUser: function(user) {
    var deferred = when.defer();

    AuthAPI.register(user).then(function(createdUser) {
      deferred.resolve(createdUser);
    }).catch(function(err) {
      this.setState({ error: err });
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
        deferred.resolve();
      });
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  },

  handleSubmit: function(evt) {
    var user = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };

    evt.stopPropagation();
    evt.preventDefault();

    this.createUser(user).then(this.uploadImage).then(function() {
      this.transitionTo('Login');
    }.bind(this));
  },

  render: function() {
    return (
      <section className="register">

        <DocumentTitle title="Register" />

        <div className="form-container">
          <div className="modal">
            <Link to="Home"><img className="logo" src="../images/logo.png" alt="Monolist logo" /></Link>

            <form id="register-form" className="register-form" encType="multipart/form-data" onSubmit={this.handleSubmit}>

              <div className="input-container">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" valueLink={this.linkState('username')} placeholder="Username" required />
              </div>

              <div className="input-container">
                <label htmlFor="email">Email</label>
                <input type="text" id="email" valueLink={this.linkState('email')} placeholder="Email address" />
              </div>

              <div className="input-container">
                <label htmlFor="image-url">Profile Image</label>
                <FileInput id="image-url" accept="image/x-png, image/gif, image/jpeg" processFile={this.updateImage} />
              </div>

              <div className="input-container">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" valueLink={this.linkState('password')} placeholder="Password" required />
              </div>

              <div className="input-container">
                <label htmlFor="confirm-password">Confirm</label>
                <input type="password" id="confirm-password" valueLink={this.linkState('confirmPassword')} placeholder="Confirm Password" required />
              </div>

              <div className="error-container nudge-half--bottom">
                {this.state.error.error}
              </div>

              <div className="submit-container">
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