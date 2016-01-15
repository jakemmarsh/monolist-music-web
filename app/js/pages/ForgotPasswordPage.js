'use strict';

import React               from 'react';
import LinkedStateMixin    from 'react-addons-linked-state-mixin';
import $                   from 'jquery';
import {Link}              from 'react-router';
import cx                  from 'classnames';
import DocumentTitle       from 'react-document-title';

import LoggedOutRouteMixin from '../mixins/LoggedOutRouteMixin';
import Helpers             from '../utils/Helpers';
import AuthAPI             from '../utils/AuthAPI';
import Mixpanel            from '../utils/Mixpanel';
import Spinner             from '../components/Spinner';

const ForgotPasswordPage = React.createClass({

  mixins: [LoggedOutRouteMixin, LinkedStateMixin],

  getInitialState() {
    return {
      username: '',
      emailSent: false,
      error: null,
      focusedInput: null,
      loading: false
    };
  },

  componentDidMount() {
    let component = this;

    $('.forgot-form input').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $('.forgot-form input').blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  isFormInvalid() {
    return !this.state.username || !this.state.username.length;
  },

  handleSubmit(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    this.setState({ error: null, loading: true });

    AuthAPI.forgotPassword(this.state.username).then(() => {
      Mixpanel.logEvent('forgot password', {
        username: this.state.username
      });
      this.setState({ emailSent: true, error: null, loading: false });
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
    let usernameLabelClasses = cx({ 'active': this.state.focusedInput === 'username' });
    let element = null;

    if ( this.state.emailSent ) {
      element = (
        <div>
          <p className="email-sent-message nudge-half--bottom">An email has been sent to the address associated with your username. It will contain instructions on resetting your password.</p>
          <Link to="/login" className="btn full">Back to Login</Link>
        </div>
      );
    } else {
      element = (
        <form className="forgot-form full-page" onSubmit={this.handleSubmit}>

          <div className="table-container">
            <div className="input-container">
              <label htmlFor="username" className={usernameLabelClasses}>Username</label>
              <div className="input">
                <input type="text" ref="usernameInput" id="username" valueLink={this.linkState('username')} placeholder="Username" required />
              </div>
            </div>
          </div>

          {this.renderError()}

          {this.renderSpinner()}

          <div className="submit-container">
            <input type="submit"
                   ref="submitButton"
                   className="btn full"
                   value="Send Reset Email"
                   disabled={this.state.loading || this.isFormInvalid() ? 'true' : ''} />
          </div>

        </form>
      );
    }

    return element;
  },

  renderBackLink() {
    if ( !this.state.emailSent ) {
      return (
        <div className="text-center nudge-half--top">
          <Link to="/login">Back to Login</Link>
        </div>
      );
    }
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Forget Your Password?')}>
      <div>

        <h4 className="flush--top nudge-half--bottom white light text-center">Forget your password?</h4>

        {this.renderForm()}

        {this.renderBackLink()}

      </div>
      </DocumentTitle>
    );
  }

});

export default ForgotPasswordPage;