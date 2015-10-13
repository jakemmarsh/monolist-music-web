'use strict';

import React              from 'react/addons';
import {History}          from 'react-router';
import DocumentTitle      from 'react-document-title';
import $                  from 'jquery';
import cx                 from 'classnames';
import _                  from 'lodash';

import LoggedInRouteMixin from '../mixins/LoggedInRouteMixin';
import Helpers            from '../utils/Helpers';
import GroupAPI           from '../utils/GroupAPI';
import AwsAPI             from '../utils/AwsAPI';
import FileInput          from '../components/FileInput';
import Spinner            from '../components/Spinner';

const CreateGroupPage = React.createClass({

  mixins: [LoggedInRouteMixin, React.addons.LinkedStateMixin, History],

  propTypes: {
    currentUser: React.PropTypes.object
  },

  getInitialState() {
    return {
      title: '',
      description: '',
      privacy: 'public',
      inviteLevel: 'member',
      image: null,
      submitDisabled: true,
      error: null,
      loading: false
    };
  },

  componentDidMount() {
    let component = this;

    $('#create-group-form input').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $('#create-group-form input').blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  componentDidUpdate(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm() {
    if ( this.state.title && this.state.title.length ) {
      this.setState({ submitDisabled: false });
    } else {
      this.setState({ submitDisabled: true });
    }
  },

  updateImage(image) {
    this.setState({ image: image });
  },

  createGroup(group) {
    return new Promise((resolve, reject) => {
      this.setState({ loading: true });

      GroupAPI.create(group).then(createdGroup => {
        resolve(createdGroup);
      }).catch(function(err) {
        reject(err);
      });
    });
  },

  uploadImage(group) {
    return new Promise((resolve, reject) => {
      if ( this.state.image ) {
        AwsAPI.uploadGroupImage(this.state.image, group.id).then(() => {
          resolve(group);
        }).catch(err => {
          console.log('error uploading group image:', err);
          resolve();
        });
      } else {
        resolve(group);
      }
    });
  },

  handleSubmit(evt) {
    let group = {
      title: this.state.title,
      description: this.state.description,
      privacy: this.state.privacy,
      inviteLevel: this.state.inviteLevel
    };

    evt.stopPropagation();
    evt.preventDefault();

    this.createGroup(group).then(this.uploadImage).then(createdGroup => {
      this.history.pushState(null, `/group/${createdGroup.slug}`);
    }).catch(err => {
      this.setState({ loading: false, error: err });
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

  renderInviteLevelSelect() {
    let inviteLevelLabelClasses = cx({ 'active': this.state.focusedInput === 'invite-level' });

    if ( this.state.privacy !== 'public' ) {
      return (
        <div className="input-container">
          <label htmlFor="invite-level" className={inviteLevelLabelClasses}>Invite Level</label>
          <div className="input">
            <select ref="inviteLevelSelect" id="invite-level" valueLink={this.linkState('inviteLevel')} required>
              <option value="1">Member</option>
              <option value="2">Admin</option>
              <option value="3">Owner</option>
            </select>
          </div>
        </div>
      );
    }
  },

  render() {
    let titleLabelClasses = cx({ 'active': this.state.focusedInput === 'title' });
    let descriptionLabelClasses = cx({ 'active': this.state.focusedInput === 'description' });
    let imageLabelClasses = cx({ 'active': this.state.focusedInput === 'image-url' });
    let privacyLabelClasses = cx({ 'active': this.state.focusedInput === 'privacy' });

    return (
      <DocumentTitle title={Helpers.buildPageTitle('Create a Group')}>
      <section className="content create-group">

        <form id="create-group-form" className="full-page narrow" onSubmit={this.handleSubmit}>
          <div className="table-container">
            <div className="input-container">
              <label htmlFor="title" className={titleLabelClasses}>Name</label>
              <div className="input">
                <input ref="titleInput"
                       type="text"
                       id="title"
                       valueLink={this.linkState('title')}
                       placeholder="Title"
                       required />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="title" className={descriptionLabelClasses}>Description</label>
              <div className="input">
                <input ref="descriptionInput"
                       type="text"
                       id="description"
                       valueLink={this.linkState('description')}
                       placeholder="Description" />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="image-url" className={imageLabelClasses}>Image</label>
              <div className="input">
                <FileInput id="image-url"
                           accept="image/x-png, image/gif, image/jpeg"
                           processFile={this.updateImage} />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="privacy" className={privacyLabelClasses}>Privacy</label>
              <div className="input">
                <select ref="privacySelect" id="privacy" valueLink={this.linkState('privacy')} required>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            {this.renderInviteLevelSelect()}
          </div>

          {this.renderError()}

          {this.renderSpinner()}

          <div className="submit-container">
            <input ref="submitButton"
                   type="submit"
                   className="btn full"
                   value="Create Group"
                   disabled={this.state.submitDisabled ? 'true' : ''} />
          </div>
        </form>

      </section>
      </DocumentTitle>
    );
  }

});

export default CreateGroupPage;