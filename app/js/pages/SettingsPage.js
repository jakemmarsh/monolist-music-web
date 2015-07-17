'use strict';

import React                   from 'react/addons';
import _                       from 'lodash';
import $                       from 'jquery';
import cx                      from 'classnames';
import DocumentTitle           from 'react-document-title';

import APIUtils                from '../utils/APIUtils';
import AwsAPI                  from '../utils/AwsAPI';
import UserActions             from '../actions/UserActions';
import AuthenticatedRouteMixin from '../mixins/AuthenticatedRouteMixin';
import FileInput               from '../components/FileInput';
import Spinner                 from '../components/Spinner';
import Avatar                  from '../components/Avatar';

var SettingsPage = React.createClass({

  mixins: [React.addons.LinkedStateMixin, AuthenticatedRouteMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      currentUser: {}
    };
  },

  getInitialState() {
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

  componentWillReceiveProps(nextProps) {
    if ( !_.isEmpty(nextProps.currentUser) ) {
      this.setState({
        email: nextProps.currentUser.email
      });
    }
  },

  componentDidMount() {
    var component = this;

    $('#settings-form input').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $('#settings-form input').blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  componentDidUpdate(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm() {
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

  updateImage(file) {
    this.setState({ newImage: file });
  },

  uploadImage() {
    return new Promise((resolve, reject) => {
      if ( this.state.newImage && !_.isEmpty(this.props.currentUser) ) {
        AwsAPI.uploadUserImage(this.state.newImage, this.props.currentUser.id).then(() => {
          resolve();
        }).catch(err => {
          console.log('error uploading user image:', err);
          // Still resolve since user needs to be updated
          resolve();
        });
      } else {
        resolve();
      }
    });
  },

  updateUser() {
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

    return new Promise((resolve, reject) => {
      UserActions.update(updates, err => {
        if ( err ) {
          console.log('will reject', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  handleSubmit(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    this.setState({ loading: true });

    this.uploadImage().then(this.updateUser).then(() => {
      this.setState({
        loading: false,
        error: null,
        newPassword: '',
        confirmNewPassword: '',
        image: null
      });
    }).catch(err => {
      this.setState({ loading: false, error: err.message });
    });
  },

  renderUserImage() {
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

  render() {
    var emailLabelClasses = cx({ 'active': this.state.focusedInput === 'email' });
    var imageLabelClasses = cx({ 'active': this.state.focusedInput === 'image-url' });
    var passwordLabelClasses = cx({ 'active': this.state.focusedInput === 'password' });
    var confirmLabelClasses = cx({ 'active': this.state.focusedInput === 'confirm-password' });

    return (
      <DocumentTitle title={APIUtils.buildPageTitle('Settings')}>
      <section className="content settings">

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
      </DocumentTitle>
    );
  }

});

export default SettingsPage;