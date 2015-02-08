/**
 * @jsx React.DOM
 */
'use strict';

var React            = require('react/addons');
//var FB               = require('fb');
var _                = require('lodash');
var $                = require('jquery');
var Link             = React.createFactory(require('react-router').Link);
var Navigation       = require('react-router').Navigation;
var cx               = React.addons.classSet;

var DocumentTitle    = require('../components/DocumentTitle');
var UserActions      = require('../actions/UserActions');
var CurrentUserStore = require('../stores/CurrentUserStore');
var Spinner          = require('../components/Spinner');

var LoginPage = React.createClass({

  statics: {
    attemptedTransition: null
  },

  mixins: [React.addons.LinkedStateMixin, Navigation],

  getInitialState: function() {
    return {
      username: this.props.query.username || '',
      password: '',
      submitDisabled: true,
      isFacebookLogin: false,
      facebookId: null,
      focusedInput: null,
      loading: false,
      error: null
    };
  },

  _onUserChange: function(err, user) {
    if ( err ) {
      this.setState({ loading: false, error: err.message });
    } else if ( !_.isEmpty(user) ) {
      this.doRedirect();
    }
  },

  componentDidMount: function() {
    var component = this;

    if ( !_.isEmpty(CurrentUserStore.user) ) {
      this.doRedirect();
    } else {
      UserActions.check(function(err, user) {
        this._onUserChange(null, user);
      }.bind(this));

      $('.login-form input').focus(function() { component.focusInput($(this).attr('id')); });
      $('.login-form input').blur(function() { component.focusInput(null); });
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) && this.isMounted() ) {
      this.checkForm();
    }
  },

  doRedirect: function() {
    var attemptedTransition;

    if ( this.attemptedTransition ) {
      console.log('has attempt:', this.attemptedTransition);
      attemptedTransition = this.attemptedTransition;
      this.attemptedTransition = null;
      attemptedTransition.retry();
    } else {
      this.replaceWith('Playlists');
    }
  },

  focusInput: function(inputId) {
    if ( this.isMounted() ) {
      this.setState({ focusedInput: inputId });
    }
  },

  checkForm: function() {
    var formIsValid = this.state.username.length && this.state.password.length;

    this.setState({ submitDisabled: !formIsValid });
  },

  // checkFbState: function() {
  //   FB.getLoginStatus(function(response) {
  //     if ( response.status === 'connected' ) {
  //       console.log('logged in via Facebook!!');
  //       this.getUserFbInfo();
  //     } else if ( response.status === 'not_authorized' ) {
  //       this.setState({ error: 'You must authorize Monolist via Facebook to log in using that method.' });
  //     } else {
  //       this.setState({ error: 'You must be logged in to Facebook to log in using that method.' });
  //     }
  //   }.bind(this));
  // },

  // getUserFbInfo: function() {
  //   FB.api('/me', { fields: 'id' }, function(response) {
  //     this.setState({ facebookId: response.id }, this.handleSubmit);
  //   }.bind(this));
  // },

  // doFbLogin: function() {
  //   this.setState({ isFacebookLogin: true });
  //   FB.login(this.checkFbState, { scope: 'public_profile,email' });
  // },

  handleSubmit: function(evt) {
    var user = {
      username: this.state.username
    };
    var loginFunction = this.state.isFacebookLogin ? UserActions.facebookLogin : UserActions.login;

    if ( !this.state.isFacebookLogin && !!this.state.password.length ) {
      user.password = this.state.password;
    } else if ( this.state.isFacebookLogin && this.state.facebookId ) {
      user.facebookId = this.state.facebookId;
    }

    evt.stopPropagation();
    evt.preventDefault();

    this.setState({ error: null, loading: true }, loginFunction.bind(null, user, this._onUserChange));
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

  renderFacebookOption: function() {
    return (
      <div>
        <a className="btn full facebook nudge-half--bottom" onClick={this.doFbLogin}>Log in with Facebook</a>
        <strong className="line-thru">or</strong>
      </div>
    );
  },

  render: function() {
    var usernameLabelClasses = cx({ 'active': this.state.focusedInput === 'username' });
    var passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });

    return (
      <div>

        <DocumentTitle title="Login" />

        {/*this.renderFacebookOption()*/}

        <form className="login-form full-page" onSubmit={this.handleSubmit}>
          <div className="table-container">
            <div className="input-container">
              <label htmlFor="username" className={usernameLabelClasses}>Username</label>
              <div className="input">
                <input type="text" id="username" valueLink={this.linkState('username')} placeholder="Username" required />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="password" className={passwordLabelClasses}>Password</label>
              <div className="input">
                <input type="password" id="password" valueLink={this.linkState('password')} placeholder="Password" required />
              </div>
            </div>
          </div>

          {this.renderError()}

          {this.renderSpinner()}

          <div className="submit-container">
            <input type="submit" className="btn full" value="Login" disabled={this.state.submitDisabled ? 'true' : ''} />
          </div>
        </form>

        <div className="text-center nudge-half--top">
          <Link to="ForgotPassword">Forgot your password?</Link>
        </div>

        <div className="text-center nudge-quarter--top">
          Don't have an account? <Link to="Register">Sign up</Link>
        </div>

      </div>
    );
  }

});

module.exports = React.createFactory(LoginPage);