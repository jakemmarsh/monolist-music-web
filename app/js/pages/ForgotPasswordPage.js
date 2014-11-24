/**
 * @jsx React.DOM
 */
'use strict';

var React            = require('react/addons');
var Reflux           = require('reflux');
var _                = require('underscore');
var $                = require('jquery');
var Navigation       = require('react-router').Navigation;
var Link             = React.createFactory(require('react-router').Link);

var AuthAPI          = require('../utils/AuthAPI');
var DocumentTitle    = require('../components/DocumentTitle');

var LoginPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Reflux.ListenerMixin, Navigation],

  getInitialState: function() {
    return {
      username: '',
      emailSent: false,
      submitDisabled: true,
      error: {
        error: null
      }
    };
  },

  componentDidUpdate: function(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm: function() {
    var $form = $('#register-form');
    var formIsValid = !$form.checkValidity || $form.checkValidity();

    if ( formIsValid ) {
      this.setState({
        submitDisabled: false
      });
    }
  },

  handleSubmit: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    AuthAPI.forgotPassword(this.state.username).then(function() {
      this.setState({
        emailSent: true
      });
    }.bind(this)).catch(function(err) {
      console.log('err:', err);
      this.setState({
        error: err
      });
    }.bind(this));
  },

  renderForm: function() {
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
        <form className="forgot-form" encType="multipart/form-data" onSubmit={this.handleSubmit}>

          <div className="input-container">
            <label htmlFor="title">Username</label>
            <input type="text" valueLink={this.linkState('username')} placeholder="Username" required />
          </div>

          <div className="error-container nudge-half--bottom">
            {this.state.error.error}
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
      <section className="forgot">

        <DocumentTitle title="Forgot Password" />

        <div className="form-container">
          <div className="modal">
            <h2 className="flush--top nudge-half--bottom white">Forget your password?</h2>
            {this.renderForm()}
          </div>
        </div>

      </section>
    );
  }

});

module.exports = React.createFactory(LoginPage);