/**
 * @jsx React.DOM
 */
'use strict';

var React          = require('react/addons');
var Reflux         = require('reflux');
var Navigation     = require('react-router').Navigation;

var AuthAPI        = require('../utils/AuthAPI');
var FileInput      = require('../components/FileInput');
var DocumentTitle = require('../components/DocumentTitle');

var LoginPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Reflux.ListenerMixin, Navigation],

  getInitialState: function() {
    return {
      username: '',
      imageUrl: '',
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
          error: 'Your passwords do not match.'
        }
      });
    } else if ( formValidity && passwordsMatch ) {
      this.setState({
        submitDisabled: false
      });
    }
  },

  updateImageUrl: function(dataUri) {
    this.setState({
      imageUrl: dataUri
    });
  },

  handleSubmit: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var user = {
      username: this.state.username,
      imageUrl: this.state.imageUrl,
      password: this.state.password
    };

    AuthAPI.register(user).then(function(user) {
      console.log('registered:', user);
      this.setState({
        error: null
      });
      this.transitionTo('Login');
    }.bind(this)).catch(function(err) {
      this.setState({ error: err });
    }.bind(this));
  },

  render: function() {
    return (
      <section className="register">

        <DocumentTitle title="Register" />

        <div className="register-container">
          <div className="modal">
            <img className="logo" src="../images/logo.png" alt="Monolist logo" />

            <form className="register-form" onSubmit={this.handleSubmit}>

              <div className="input-container">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" valueLink={this.linkState('username')} placeholder="Username" required />
              </div>

              <div className="input-container">
                <label htmlFor="imageUrl">Profile Image</label>
                <FileInput id="imageUrl" accept="image/x-png, image/gif, image/jpeg" processFile={this.updateImageUrl} />
              </div>

              <div className="input-container">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" valueLink={this.linkState('password')} placeholder="Password" required />
              </div>

              <div className="input-container">
                <label htmlFor="confirmPassword">Confirm</label>
                <input type="password" id="confirmPassword" valueLink={this.linkState('confirmPassword')} placeholder="Confirm Password" required />
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