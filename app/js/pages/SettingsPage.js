/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react/addons');
var when                    = require('when');
var _                       = require('lodash');
var $                       = require('jquery');
var cx                      = React.addons.classSet;

var AwsAPI                  = require('../utils/AwsAPI');
var UserActions             = require('../actions/UserActions');
var DocumentTitle           = require('../components/DocumentTitle');
var AuthenticatedRouteMixin = require('../mixins/AuthenticatedRouteMixin');
var FileInput               = require('../components/FileInput');
var Spinner                 = require('../components/Spinner');
var Avatar                  = require('../components/Avatar');

var SettingsPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, AuthenticatedRouteMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {}
    };
  },

  getInitialState: function() {
    return {
      email: this.props.currentUser.email,
      newImage: null,
      newPassword: '',
      confirmNewPassword: '',
      focusedInput: null,
      submitDisabled: true,
      loading: false,
      error: null
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if ( !_.isEmpty(nextProps.currentUser) ) {
      this.setState({
        email: nextProps.currentUser.email
      });
    }
  },

  componentDidMount: function() {
    var component = this;

    $('#settings-form input').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $('#settings-form input').blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm: function() {
    var hasNewEmail = this.state.email && this.state.email.length && this.state.email !== this.props.currentUser.email;
    var hasNewImage = !!this.state.newImage;
    var hasNewPassword = this.state.newPassword && this.state.newPassword.length;
    var newPasswordsMatch = this.state.newPassword === this.state.confirmNewPassword;

    if ( hasNewPassword && !newPasswordsMatch ) {
      this.setState({ error: 'Those passwords do not match!' });
    } else if ( hasNewEmail || hasNewImage || (hasNewPassword && newPasswordsMatch) ) {
      this.setState({ error: null, submitDisabled: false });
    } else {
      this.setState({ submitDisabled: true });
    }
  },

  updateImage: function(file) {
    this.setState({ newImage: file });
  },

  uploadImage: function() {
    var deferred = when.defer();

    if ( this.state.newImage && !_.isEmpty(this.props.currentUser) ) {
      AwsAPI.uploadUserImage(this.state.newImage, this.props.currentUser.id).then(function() {
        deferred.resolve();
      }).catch(function(err) {
        console.log('error uploading user image:', err);
        // Still resolve since user needs to be updated
        deferred.resolve();
      });
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  },

  updateUser: function() {
    var deferred = when.defer();
    var hasNewEmail = this.state.email && this.state.email.length && this.state.email !== this.props.currentUser.email;
    var hasNewPassword = this.state.newPassword && this.state.newPassword.length;
    var newPasswordsMatch = this.state.newPassword === this.state.confirmNewPassword;
    var updates = {};

    if ( hasNewEmail ) {
      updates.email = this.state.email;
    }

    if ( hasNewPassword && newPasswordsMatch ) {
      updates.password = this.state.newPassword;
    }

    UserActions.update(updates, function(err) {
      if ( err ) {
        console.log('will reject', err);
        deferred.reject(err);
      } else {
        deferred.resolve();
      }
    });

    return deferred.promise;
  },

  handleSubmit: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    this.setState({ loading: true });

    this.uploadImage().then(this.updateUser).then(function() {
      this.setState({
        loading: false,
        error: null,
        newPassword: '',
        confirmNewPassword: '',
        image: null
      });
    }.bind(this)).catch(function(err) {
      this.setState({ loading: false, error: err.message });
    }.bind(this));
  },

  renderUserImage: function() {
    var element = null;

    if ( this.props.currentUser.imageUrl ) {
      element = (
        <div>
          <div />
          <div className="text-center">
            <Avatar user={this.props.currentUser} size={'200px'} style={{ 'margin': '0 auto' }} />
          </div>
        </div>
      );
    }

    return element;
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

  render: function() {
    var emailLabelClasses = cx({ 'active': this.state.focusedInput === 'email' });
    var imageLabelClasses = cx({ 'active': this.state.focusedInput === 'image-url' });
    var passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });
    var confirmLabelClasses = cx({ 'active': this.state.focusedInput === 'confirm-password' });

    return (
      <section className="content settings">

        <DocumentTitle title="Settings" />

        <form id="settings-form" className="full-page narrow" onSubmit={this.handleSubmit}>

          {this.renderUserImage()}

          <div className="table-container">
            <div className="input-container">
              <label htmlFor="username">Username</label>
              <div className="input">
                <input type="text" id="username" value={this.props.currentUser.username} placeholder="Username" disabled />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="email" className={emailLabelClasses}>Email</label>
              <div className="input">
                <input type="text" id="email" valueLink={this.linkState('email')} placeholder="Email address" />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="image-url" className={imageLabelClasses}>New Image</label>
              <div className="input">
                <FileInput id="image-url" accept="image/x-png, image/gif, image/jpeg" processFile={this.updateImage} />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="password" className={passwordLabelClasses}>New Password</label>
              <div className="input">
                <input type="password" id="password" valueLink={this.linkState('newPassword')} placeholder="New password" />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="confirm-password" className={confirmLabelClasses}>Confirm</label>
              <div className="input">
                <input type="password" id="confirm-password" valueLink={this.linkState('confirmNewPassword')} placeholder="Confirm new password" />
              </div>
            </div>
          </div>

          {this.renderError()}

          {this.renderSpinner()}

          <div className="submit-container">
            <input type="submit" className="btn full" value="Save Changes" disabled={this.state.submitDisabled ? 'true' : ''} />
          </div>

        </form>

      </section>
    );
  }

});

module.exports = React.createFactory(SettingsPage);