'use strict';

import React               from 'react';
import LinkedStateMixin    from 'react-addons-linked-state-mixin';
import _                   from 'lodash';
import $                   from 'jquery';
import {Link}              from 'react-router';
import cx                  from 'classnames';
import DocumentTitle       from 'react-document-title';

import LoggedOutRouteMixin from '../mixins/LoggedOutRouteMixin';
import Helpers             from '../utils/Helpers';
import AuthAPI             from '../utils/AuthAPI';
import Spinner             from '../components/Spinner';

const ResetPasswordPage = React.createClass({

  mixins: [LoggedOutRouteMixin, LinkedStateMixin],

  propTypes: {
    params: React.PropTypes.object
  },

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
    let component = this;

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
    let passwordsTyped = this.state.password.length && this.state.confirmPassword.length;
    let passwordsMatch = this.state.password === this.state.confirmPassword;

    if ( passwordsTyped && !passwordsMatch ) {
      this.setState({ error: 'Those passwords do not match!', submitDisabled: true });
    } else if ( passwordsTyped ) {
      this.setState({ error: null, submitDisabled: false });
    } else {
      this.setState({ submitDisabled: true });
    }
  },

  handleSubmit(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    this.setState({ error: null, loading: true });

    AuthAPI.resetPassword(this.props.params.userId, this.props.params.key, this.state.password).then(() => {
      this.setState({ passwordReset: true, error: null, loading: false });
    }).catch((err) => {
      this.setState({ error: err, loading: false });
    });
  },

  renderError() {
    if ( this.state.error ) {
      return (
        <div className="error-container nudge-half--bottom text-center">
          {this.state.error}
        </div>
      );
    }
  },

  renderSpinner() {
    if ( this.state.loading ) {
      return (
        <div className="spinner-container text-center nudge-half--bottom">
          <Spinner size={10} />
        </div>
      );
    }
  },

  renderForm() {
    let passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });
    let confirmLabelClasses = cx({ 'active': this.state.focusedInput === 'confirm-password' });

    let element = null;

    if ( this.state.passwordReset ) {
      element = (
        <div>
          <p className="nudge-half--bottom email-sent-message">Your password has been successfully reset!</p>
          <Link to="/login" className="btn">Log In</Link>
        </div>
      );
    } else {
      element = (
        <form className="reset-form full-page" onSubmit={this.handleSubmit}>

          <div className="table-container">
            <div className="input-container">
              <label htmlFor="password" className={passwordLabelClasses}>Password</label>
              <input type="password"
                     ref="passwordInput"
                     id="password"
                     valueLink={this.linkState('password')}
                     placeholder="Your new password"
                     required />
            </div>

            <div className="input-container">
              <label htmlFor="confirm-password" className={confirmLabelClasses}>Confirm</label>
              <input type="password"
                     ref="confirmInput"
                     id="confirm-password"
                     valueLink={this.linkState('confirmPassword')}
                     placeholder="Confirm your new password"
                     required />
            </div>
          </div>

          {this.renderError()}

          {this.renderSpinner()}

          <div className="bottom-buttons-container">
            <div className="submit-container">
              <input type="submit" ref="submitButton" className="btn full" value="Reset" disabled={this.state.submitDisabled ? 'true' : ''} />
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