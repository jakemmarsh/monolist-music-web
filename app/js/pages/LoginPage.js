/**
 * @jsx React.DOM
 */
'use strict';

var React            = require('react/addons');
var Reflux           = require('reflux');
var Navigation       = require('react-router').Navigation;

var UserActions      = require('../actions/UserActions');
var PageTitleMixin   = require('../mixins/PageTitleMixin');
var CurrentUserStore = require('../stores/CurrentUserStore');

var LoginPage = React.createClass({

  mixins: [PageTitleMixin, React.addons.LinkedStateMixin, Reflux.ListenerMixin, Navigation],

  statics: {
    attemptedTransition: null
  },

  getInitialState: function() {
    return {
      username: '',
      password: ''
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
      this.updatePageTitle('Login');
    }
  },

  formIsValid: function() {
    return !!this.state.username.length && !!this.state.password.length;
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

              <div className="submit-container">
                <input type="submit" className="btn" value="Login" disabled={this.formIsValid() ? '' : 'true'} />
              </div>

            </form>
          </div>
        </div>

      </section>
    );
  }

});

module.exports = React.createFactory(LoginPage);