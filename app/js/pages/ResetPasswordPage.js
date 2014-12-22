/**
 * @jsx React.DOM
 */
'use strict';

var React         = require('react/addons');
var _             = require('lodash');

var DocumentTitle = require('../components/DocumentTitle');

var ResetPasswordPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      passwordReset: false,
      error: null,
      password: '',
      confirmPassword: '',
      submitDisabled: true
    };
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

    AuthAPI.resetPassword(this.props.params.userId, this.props.params.key, this.state.password).then(function() {
      this.setState({ passwordReset: true, error: null });
    }.bind(this)).catch(function(err) {
      console.log('err:', err);
      this.setState({ error: err.message });
    }.bind(this));
  },

  renderForm: function() {
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
        <form className="reset-form" onSubmit={this.handleSubmit}>

          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" valueLink={this.linkState('password')} placeholder="Your new password" required />
          </div>

          <div className="input-container">
            <label htmlFor="confirm-password">Confirm</label>
            <input type="password" id="confirm-password" valueLink={this.linkState('confirmPassword')} placeholder="Confirm your new password" required />
          </div>

          <div className="error-container nudge-half--bottom">
            {this.state.error}
          </div>

          <div className="bottom-buttons-container">
            <div className="submit-container">
              <input type="submit" className="btn" value="Reset" disabled={this.state.submitDisabled ? 'true' : ''} />
            </div>
          </div>

        </form>
      );
    }

    return element;
  },

  render: function() {
    return (
      <section className="reset">

        <DocumentTitle title="Reset Your Password" />

        <div className="form-container">
          <div className="modal">
            <h2 className="flush--top nudge-half--bottom white">Reset your password</h2>
            {this.renderForm()}
          </div>
        </div>

      </section>
    );
  }

});

module.exports = React.createFactory(ResetPasswordPage);