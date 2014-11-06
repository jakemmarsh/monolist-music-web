/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react/addons');
var Navigation  = require('react-router').Navigation;

var AuthAPI     = require('../utils/AuthAPI');
var FileInput   = require('./FileInput');

var RegisterForm = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Navigation],

  getInitialState: function() {
    return {
      username: '',
      imageUrl: '',
      password: '',
      confirmPassword: ''
    };
  },

  passwordsSame: function() {
    return this.state.password === this.state.confirmPassword;
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
      this.transitionTo('Login');
    }.bind(this));
  },

  render: function() {
    return (
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

        <div className="submit-container">
          <input type="submit" className="btn" value="Register" />
        </div>

      </form>
    );
  }

});

module.exports = React.createFactory(RegisterForm);