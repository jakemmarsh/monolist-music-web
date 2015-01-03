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

var LoginPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Reflux.ListenerMixin, Navigation],

  getInitialState: function() {
    return {
      username: '',
      emailSent: false,
      submitDisabled: true,
      error: null,
      focusedInput: null
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

    AuthAPI.forgotPassword(this.state.username).then(function() {
      this.setState({ emailSent: true, error: null });
    }.bind(this)).catch(function(err) {
      console.log('err doing forgot password:', err);
      this.setState({ error: err.message });
    }.bind(this));
  },

  renderForm: function() {
    var usernameLabelClasses = cx({ 'active': this.state.focusedInput === 'username' });
    var element = null;

    if ( this.state.emailSent ) {
      element = (
        <div>
          <p className="nudge-half--bottom">An email has been sent to the address associated with your username. It will contain instructions on resetting your password.</p>
          <Link to="Home" className="btn">Home</Link>
        </div>
      );
    } else {
      element = (
        <form className="forgot-form" onSubmit={this.handleSubmit}>

          <div className="input-container">
            <label htmlFor="username" className={usernameLabelClasses}>Username</label>
            <input type="text" id="username" valueLink={this.linkState('username')} placeholder="Username" required />
          </div>

          <div className="error-container nudge-half--bottom">
            {this.state.error}
          </div>

          <div className="bottom-buttons-container">
            <div className="submit-container">
              <input type="submit" className="btn" value="Send Reset Email" disabled={this.state.submitDisabled ? 'true' : ''} />
            </div>
          </div>

        </form>
      );
    }

    return element;
  },

  render: function() {
    return (
      <section className="forgot page-modal">

        <DocumentTitle title="Forget Your Password?" />

        <div className="form-container">
          <div className="modal">
            <Link to="Home"><img className="logo" src="https://assets.monolist.co/images/logo.png" alt="Monolist logo" /></Link>
            <h4 className="flush--top nudge-half--bottom white light">Forget your password?</h4>
            {this.renderForm()}
          </div>
        </div>

      </section>
    );
  }

});

module.exports = React.createFactory(LoginPage);