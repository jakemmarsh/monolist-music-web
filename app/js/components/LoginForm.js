/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react/addons');
var Navigation  = require('react-router').Navigation;

var UserActions = require('../actions/UserActions');

var LoginForm = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Navigation],

  getInitialState: function() {
    return {
      username: '',
      password: ''
    };
  },

  handleSubmit: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var user = {
      username: this.state.username,
      password: this.state.password
    };

    UserActions.login(user);
  },

  render: function() {
    return (
      <form className="login-form" onSubmit={this.handleSubmit}>

        <div className="input-container">
          <label htmlFor="title">Username</label>
          <input type="text" valueLink={this.linkState('username')} placeholder="Username" required />
        </div>

        <div className="input-container">
          <label htmlFor="title">Password</label>
          <input type="password" valueLink={this.linkState('password')} placeholder="Password" required />
        </div>

        <div className="submit-container">
          <input type="submit" className="btn" value="Login" />
        </div>

      </form>
    );
  }

});

module.exports = React.createFactory(LoginForm);