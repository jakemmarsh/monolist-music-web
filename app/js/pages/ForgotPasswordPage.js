/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var Reflux        = require('reflux');
var _             = require('lodash');
var $             = require('jquery');
var Navigation    = require('react-router').Navigation;
var Link          = React.createFactory(require('react-router').Link);
var cx            = React.addons.classSet;

var AuthAPI       = require('../utils/AuthAPI');
var DocumentTitle = require('../components/DocumentTitle');
var Spinner       = require('../components/Spinner');

var LoginPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Reflux.ListenerMixin, Navigation],

  getInitialState: function() {
    return {
      username: '',
      emailSent: false,
      submitDisabled: true,
      error: null,
      focusedInput: null,
      loading: false
    };
  },

  componentDidMount: function() {
    var component = this;

    $('.forgot-form input').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $('.forgot-form input').blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm: function() {
    var formIsValid = this.state.username && this.state.username.length;

    if ( formIsValid ) {
      this.setState({ submitDisabled: false });
    } else {
      this.setState({ submitDisabled: true });
    }
  },

  handleSubmit: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    this.setState({ error: null, loading: true });

    AuthAPI.forgotPassword(this.state.username).then(function() {
      this.setState({ emailSent: true, error: null, loading: false });
    }.bind(this)).catch(function(err) {
      console.log('err doing forgot password:', err);
      this.setState({ error: err.message, loading: false });
    }.bind(this));
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

  renderForm: function() {
    var usernameLabelClasses = cx({ 'active': this.state.focusedInput === 'username' });
    var element = null;

    if ( this.state.emailSent ) {
      element = (
        <div>
          <p className="nudge-half--bottom">An email has been sent to the address associated with your username. It will contain instructions on resetting your password.</p>
          <Link to="Login" className="btn full">Back to Login</Link>
        </div>
      );
    } else {
      element = (
        <form className="forgot-form full-page" onSubmit={this.handleSubmit}>

          <div className="table-container">
            <div className="input-container">
              <label htmlFor="username" className={usernameLabelClasses}>Username</label>
              <div className="input">
                <input type="text" id="username" valueLink={this.linkState('username')} placeholder="Username" required />
              </div>
            </div>
          </div>

          {this.renderError()}

          {this.renderSpinner()}

          <div className="submit-container">
            <input type="submit" className="btn full" value="Send Reset Email" disabled={this.state.submitDisabled ? 'true' : ''} />
          </div>

        </form>
      );
    }

    return element;
  },

  renderBackLink: function() {
    var element = null;

    if ( !this.state.emailSent ) {
      element = (
        <div className="text-center nudge-half--top">
          <Link to="Login">Back to Login</Link>
        </div>
      );
    }

    return element;
  },

  render: function() {
    return (
      <div>

        <DocumentTitle title="Forget Your Password?" />

        <h4 className="flush--top nudge-half--bottom white light text-center">Forget your password?</h4>

        {this.renderForm()}

        {this.renderBackLink()}

      </div>
    );
  }

});

module.exports = React.createFactory(LoginPage);