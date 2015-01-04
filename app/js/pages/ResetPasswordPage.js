/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var _             = require('lodash');
var $             = require('jquery');
var Link          = React.createFactory(require('react-router').Link);
var cx            = React.addons.classSet;

var AuthAPI       = require('../utils/AuthAPI');
var DocumentTitle = require('../components/DocumentTitle');
var Spinner       = require('../components/Spinner');

var ResetPasswordPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      passwordReset: false,
      error: null,
      password: '',
      confirmPassword: '',
      submitDisabled: true,
      focusedInput: null,
      loading: false
    };
  },

  componentDidMount: function() {
    var component = this;

    $('.reset-form input').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $('.reset-form input').blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm: function() {
    var passwordsTyped = this.state.password.length && this.state.confirmPassword.length;
    var passwordsMatch = this.state.password === this.state.confirmPassword;

    if ( passwordsTyped && !passwordsMatch ) {
      this.setState({ error: 'Those passwords do not match!', submitDisabled: true });
    } else if ( passwordsTyped ) {
      this.setState({ error: null, submitDisabled: false });
    }
  },

  handleSubmit: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    this.setState({ error: null, loading: true });

    AuthAPI.resetPassword(this.props.params.userId, this.props.params.key, this.state.password).then(function() {
      this.setState({ passwordReset: true, error: null, loading: false });
    }.bind(this)).catch(function(err) {
      console.log('err:', err);
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
    var passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });
    var confirmLabelClasses = cx({ 'active': this.state.focusedInput === 'confirm-password' });

    var element = null;

    if ( this.state.passwordReset ) {
      element = (
        <div>
          <p className="nudge-half--bottom">Your password has been successfully reset!</p>
          <Link to="Login" className="btn">Log In</Link>
        </div>
      );
    } else {
      element = (
        <form className="reset-form full-page" onSubmit={this.handleSubmit}>

          <div className="table-container">
            <div className="input-container">
              <label htmlFor="password" className={passwordLabelClasses}>Password</label>
              <input type="password" id="password" valueLink={this.linkState('password')} placeholder="Your new password" required />
            </div>

            <div className="input-container">
              <label htmlFor="confirm-password" className={confirmLabelClasses}>Confirm</label>
              <input type="password" id="confirm-password" valueLink={this.linkState('confirmPassword')} placeholder="Confirm your new password" required />
            </div>
          </div>

          {this.renderError()}

          {this.renderSpinner()}

          <div className="bottom-buttons-container">
            <div className="submit-container">
              <input type="submit" className="btn full" value="Reset" disabled={this.state.submitDisabled ? 'true' : ''} />
            </div>
          </div>

        </form>
      );
    }

    return element;
  },

  render: function() {
    return (
      <div>

        <DocumentTitle title="Reset Your Password" />

        <h4 className="flush--top nudge-half--bottom white light">Reset your password</h4>

        {this.renderForm()}

      </div>
    );
  }

});

module.exports = React.createFactory(ResetPasswordPage);