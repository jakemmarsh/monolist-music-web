/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react/addons');
var Reflux          = require('reflux');
var Navigation      = require('react-router').Navigation;

var PageTitleMixin = require('../mixins/PageTitleMixin');
var AuthAPI        = require('../utils/AuthAPI');
var FileInput      = require('../components/FileInput');

var LoginPage = React.createClass({

  mixins: [PageTitleMixin, React.addons.LinkedStateMixin, Reflux.ListenerMixin, Navigation],

  getInitialState: function() {
    return {
      username: '',
      imageUrl: '',
      password: '',
      confirmPassword: '',
      error: null
    };
  },

  componentDidMount: function() {
    this.updatePageTitle('Register');
  },

  passwordsSame: function() {
    return this.state.password === this.state.confirmPassword;
  },

  formIsValid: function() {
    return !!this.state.username.length && !!this.state.password.length && !!this.state.confirmPassword.length && (this.state.password === this.state.confirmPassword);
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
      this.setState({
        error: err
      });
    }.bind(this));
  },

  render: function() {
    return (
      <section className="register">

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

              <div className="error-container">
                {this.state.error}
              </div>

              <div className="submit-container">
                <input type="submit" className="btn" value="Register" disabled={this.formIsValid() ? '' : 'true'} />
              </div>

            </form>
          </div>
        </div>

      </section>
    );
  }

});

module.exports = React.createFactory(LoginPage);