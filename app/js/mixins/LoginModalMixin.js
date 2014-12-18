/**
 * @jsx React.DOM
 */
'use strict';

var React                 = require('react/addons');
var _                     = require('lodash');

var LayeredComponentMixin = require('./LayeredComponentMixin');
var UserActions           = require('../actions/UserActions');
var Modal                 = require('../components/Modal');
var Spinner               = require('../components/Spinner');

var LoginModalMixin = {

  // NOTE: LinkedStateMixin is required, but already being loaded by Header.js where this mixin is used
  mixins: [LayeredComponentMixin],

  getInitialState: function() {
    return {
      showLoginModal: false,
      username: '',
      password: '',
      submitDisabled: true,
      loading: false,
      error: {}
    };
  },

  componentDidUpdate: function(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  toggleLoginModal: function() {
    this.setState({ showLoginModal: !this.state.showLoginModal });
  },

  checkForm: function() {
    var formIsValid = this.state.username.length && this.state.password.length;

    if ( formIsValid ) {
      this.setState({ submitDisabled: false });
    } else {
      this.setState({ submitDisabled: true });
    }
  },

  handleSubmit: function(evt) {
    var user = {
      username: this.state.username,
      password: this.state.password
    };

    evt.stopPropagation();
    evt.preventDefault();

    this.setState({ loading: true });

    UserActions.login(user, function(err) {
      if ( err ) {
        this.setState({ error: err, loading: false });
      } else {
        this.setState({ loading: false, showLoginModal: false });
      }
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

  renderLayer: function() {
    var element = (<span />);

    if ( this.state.showLoginModal ) {
      element = (
        <Modal className="login" onRequestClose={this.toggleLoginModal}>
          <form className="login-form" encType="multipart/form-data" onSubmit={this.handleSubmit}>

            <div className="input-container">
              <label htmlFor="title">Username</label>
              <input type="text" valueLink={this.linkState('username')} placeholder="Username" required />
            </div>

            <div className="input-container">
              <label htmlFor="title">Password</label>
              <input type="password" valueLink={this.linkState('password')} placeholder="Password" required />
            </div>

            <div className="error-container nudge-half--bottom">
              {this.state.error}
            </div>

            <div className="bottom-buttons-container">
              <ul className="options-container">
                  <li><a href="/register">Not registered yet?</a></li>
                  <li><a href="/forgot">Forget your password?</a></li>
                </ul>
              <div className="submit-container">
                {this.renderSpinner()}
                <input type="submit" className="btn" value="Login" disabled={this.state.submitDisabled ? 'true' : ''} />
              </div>
            </div>

          </form>
        </Modal>
      );
    }

    return element;
  },

};

module.exports = LoginModalMixin;