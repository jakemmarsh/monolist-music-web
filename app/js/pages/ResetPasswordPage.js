'use strict';

import React               from 'react';
import LinkedStateMixin    from 'react-addons-linked-state-mixin';
import {Link}              from 'react-router';
import cx                  from 'classnames';
import DocumentTitle       from 'react-document-title';

import LoggedOutRouteMixin from '../mixins/LoggedOutRouteMixin';
import LabelHighlightMixin from '../mixins/LabelHighlightMixin';
import Helpers             from '../utils/Helpers';
import AuthAPI             from '../utils/AuthAPI';
import Mixpanel            from '../utils/Mixpanel';
import Spinner             from '../components/Spinner';

const INPUT_SELECTOR = '.reset-form input';

const ResetPasswordPage = React.createClass({

  mixins: [LoggedOutRouteMixin, LinkedStateMixin, LabelHighlightMixin(INPUT_SELECTOR)],

  propTypes: {
    params: React.PropTypes.object
  },

  getInitialState() {
    return {
      passwordReset: false,
      error: null,
      password: '',
      confirmPassword: '',
      focusedInput: null,
      loading: false
    };
  },

  isFormInvalid() {
    return !this.state.password.length || !this.state.confirmPassword.length;
  },

  handleSubmit(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    if ( this.state.password !== this.state.confirmPassword ) {
      this.setState({
        error: 'Those passwords don\'t match!'
      });
    } else {
      this.setState({ error: null, loading: true });

      AuthAPI.resetPassword(this.props.params.userId, this.props.params.key, this.state.password).then(() => {
        Mixpanel.logEvent('reset password', {
          userId: this.props.params.userId
        });
        this.setState({ passwordReset: true, error: null, loading: false });
      }).catch((err) => {
        this.setState({ error: err, loading: false });
      });
    }
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
    const passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });
    const confirmLabelClasses = cx({ 'active': this.state.focusedInput === 'confirm-password' });

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
              <div className="input">
                <input type="password"
                       ref="passwordInput"
                       id="password"
                       valueLink={this.linkState('password')}
                       placeholder="Your new password"
                       required />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="confirm-password" className={confirmLabelClasses}>Confirm</label>
              <div className="input">
                <input type="password"
                       ref="confirmInput"
                       id="confirm-password"
                       valueLink={this.linkState('confirmPassword')}
                       placeholder="Confirm your new password"
                       required />
              </div>
            </div>
          </div>

          {this.renderError()}

          {this.renderSpinner()}

          <div className="bottom-buttons-container">
            <div className="submit-container">
              <input type="submit"
                     ref="submitButton"
                     className="btn full"
                     value="Reset"
                     disabled={this.state.loading || this.isFormInvalid() ? 'true' : ''} />
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