/**
 * @jsx React.DOM
 */
'use strict';

var React            = require('react/addons');
var Reflux           = require('reflux');
var _                = require('underscore');
var $                = require('jquery');
var Navigation       = require('react-router').Navigation;

var DocumentTitle    = require('../components/DocumentTitle');
var UserActions      = require('../actions/UserActions');
var CurrentUserStore = require('../stores/CurrentUserStore');

var LoginPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Reflux.ListenerMixin, Navigation],

  statics: {
    attemptedTransition: null
  },

  getInitialState: function() {
    return {
      username: '',
      password: '',
      submitDisabled: true,
      error: null
    };
  },

  _onUserChange: function(user) {
    if ( user !== null ) {
      this.transitionTo('Explore');
    }
  },

  componentWillMount: function() {
    UserActions.check(this._onUserChange);
  },

  componentDidMount: function() {
    if ( CurrentUserStore.user !== null ) {
      this.transitionTo('Explore');
    } else {
      this.listenTo(CurrentUserStore, this._onUserChange);
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm: function() {
    var $form = $('#register-form');
    var formIsValid = !$form.checkValidity || $form.checkValidity();

    if ( formIsValid ) {
      this.setState({
        submitDisabled: false,
        error: null
      });
    }
  },

  handleSubmit: function(evt) {
    var user = {
      username: this.state.username,
      password: this.state.password
    };
    var transition;

    evt.stopPropagation();
    evt.preventDefault();

    UserActions.login(user, function() {
      if ( LoginPage.attemptedTransition ) {
        transition = LoginPage.attemptedTransition;
        LoginPage.attemptedTransition = null;
        transition.retry();
      } else {
        this.transitionTo('Explore');
      }
    }.bind(this));
  },

  render: function() {
    return (
      <section className="login">

        <DocumentTitle title="Login" />

        <div className="login-container">
          <div className="modal">
            <img className="logo" src="../images/logo.png" alt="Monolist logo" />

            <form className="login-form" encType="multipart/form-data" onSubmit={this.handleSubmit}>

              <div className="input-container">
                <label htmlFor="title">Username</label>
                <input type="text" valueLink={this.linkState('username')} placeholder="Username" required />
              </div>

              <div className="input-container">
                <label htmlFor="title">Password</label>
                <input type="password" valueLink={this.linkState('password')} placeholder="Password" required />
              </div>

              <div className="error-container">
                {this.state.error}
              </div>

              <div className="submit-container">
                <input type="submit" className="btn" value="Login" disabled={this.state.submitDisabled ? 'true' : ''} />
              </div>

            </form>
          </div>
        </div>

      </section>
    );
  }

});

module.exports = React.createFactory(LoginPage);