/**
 * @jsx React.DOM
 */
'use strict';

var React            = require('react/addons');
var Reflux           = require('reflux');
var _                = require('lodash');
var $                = require('jquery');
var Navigation       = require('react-router').Navigation;
var Link             = React.createFactory(require('react-router').Link);
var cx               = React.addons.classSet;

var ListLink         = require('../components/ListLink');
var DocumentTitle    = require('../components/DocumentTitle');
var UserActions      = require('../actions/UserActions');
var CurrentUserStore = require('../stores/CurrentUserStore');
var Spinner          = require('../components/Spinner');

var LoginPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Reflux.ListenerMixin, Navigation],

  getInitialState: function() {
    return {
      username: '',
      password: '',
      submitDisabled: true,
      focusedInput: null,
      loading: false,
      error: null
    };
  },

  _onUserChange: function(err, user) {
    if ( !_.isEmpty(err) ) {
      this.setState({
        error: {
          error: err
        }
      });
    } else if ( !_.isEmpty(user) ) {
      this.transitionTo('Playlists');
    }
  },

  componentWillMount: function() {
    UserActions.check(this._onUserChange);
  },

  componentDidMount: function() {
    var component = this;

    if ( CurrentUserStore.user !== null ) {
      this.transitionTo('Playlists');
    } else {
      this.listenTo(CurrentUserStore, this._onUserChange);
      $('.login-form input').focus(function() {
        component.setState({ focusedInput: $(this).attr('id') });
      });

      $('.login-form input').blur(function() {
        component.setState({ focusedInput: null });
      });
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
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
        this.transitionTo('Playlists');
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

  render: function() {
    var usernameLabelClasses = cx({ 'active': this.state.focusedInput === 'username' });
    var passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });

    return (
      <section className="login">

        <DocumentTitle title="Login" />

        <div className="form-container">
          <div className="modal">
            <Link to="Home"><img className="logo" src="../images/logo.png" alt="Monolist logo" /></Link>

            <form className="login-form" onSubmit={this.handleSubmit}>

              <div className="input-container">
                <label htmlFor="username" className={usernameLabelClasses}>Username</label>
                <input type="text" id="username" valueLink={this.linkState('username')} placeholder="Username" required />
              </div>

              <div className="input-container">
                <label htmlFor="password" className={passwordLabelClasses}>Password</label>
                <input type="password" id="password" valueLink={this.linkState('password')} placeholder="Password" required />
              </div>

              <div className="error-container nudge-half--bottom">
                {this.state.error}
              </div>

              <div className="bottom-buttons-container">
                <ul className="options-container">
                  <ListLink to="Register">Not registered yet?</ListLink>
                  <ListLink to="ForgotPassword">Forget your password?</ListLink>
                </ul>
                <div className="submit-container">
                  {this.renderSpinner()}
                  <input type="submit" className="btn" value="Login" disabled={this.state.submitDisabled ? 'true' : ''} />
                </div>
              </div>

            </form>
          </div>
        </div>

      </section>
    );
  }

});

module.exports = React.createFactory(LoginPage);