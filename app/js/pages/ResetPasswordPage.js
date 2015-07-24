'use strict';

import React         from 'react/addons';
import _             from 'lodash';
import $             from 'jquery';
import {Link}        from 'react-router';
import cx            from 'classnames';
import DocumentTitle from 'react-document-title';

import Helpers       from '../utils/Helpers';
import AuthAPI       from '../utils/AuthAPI';
import Spinner       from '../components/Spinner';

var ResetPasswordPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState() {
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

  componentDidMount() {
    var component = this;

    $('.reset-form input').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $('.reset-form input').blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  componentDidUpdate(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm() {
    var passwordsTyped = this.state.password.length && this.state.confirmPassword.length;
    var passwordsMatch = this.state.password === this.state.confirmPassword;

    if ( passwordsTyped && !passwordsMatch ) {
      this.setState({ error: 'Those passwords do not match!', submitDisabled: true });
    } else if ( passwordsTyped ) {
      this.setState({ error: null, submitDisabled: false });
    }
  },

  handleSubmit(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    this.setState({ error: null, loading: true });

    AuthAPI.resetPassword(this.props.params.userId, this.props.params.key, this.state.password).then(() => {
      this.setState({ passwordReset: true, error: null, loading: false });
    }).catch(err => {
      console.log('err:', err);
      this.setState({ error: err.message, loading: false });
    });
  },

  renderError() {
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

  renderSpinner() {
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

  renderForm() {
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

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Reset Your Password')}>
      <div>
        <h4 className="flush--top nudge-half--bottom white light">Reset your password</h4>

        {this.renderForm()}
      </div>
      </DocumentTitle>
    );
  }

});

export default ResetPasswordPage;