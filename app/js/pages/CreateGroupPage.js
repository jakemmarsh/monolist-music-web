'use strict';

import React               from 'react';
import {History}           from 'react-router';
import DocumentTitle       from 'react-document-title';
import cx                  from 'classnames';

import LoggedInRouteMixin  from '../mixins/LoggedInRouteMixin';
import LabelHighlightMixin from '../mixins/LabelHighlightMixin';
import Helpers             from '../utils/Helpers';
import GroupActions        from '../actions/GroupActions';
import AwsAPI              from '../utils/AwsAPI';
import Title               from '../components/Title';
import FileInput           from '../components/FileInput';
import TagInput            from '../components/TagInput';
import Spinner             from '../components/Spinner';

const CreateGroupPage = React.createClass({

  mixins: [LoggedInRouteMixin, History, LabelHighlightMixin],

  propTypes: {
    currentUser: React.PropTypes.object
  },

  getInitialState() {
    return {
      title: '',
      description: '',
      privacy: 'public',
      inviteLevel: 1,
      image: null,
      tags: [],
      error: null,
      loading: false
    };
  },

  isFormInvalid() {
    return !this.state.title || !this.state.title.length;
  },

  updateImage(image) {
    this.setState({ image: image });
  },

  handleTitleChange(evt) {
    this.setState({
      title: evt.target.value
    });
  },

  handleDescriptionChange(evt) {
    this.setState({
      description: evt.target.value
    });
  },

  handleInviteLevelChange(evt) {
    this.setState({
      inviteLevel: evt.target.value
    });
  },

  handleTagsChange(tags) {
    this.setState({ tags: tags });
  },

  handlePrivacyChange(evt) {
    this.setState({
      privacy: evt.target.value
    });
  },

  createGroup(group) {
    return new Promise((resolve, reject) => {
      this.setState({
        error: null,
        loading: true
      });

      GroupActions.create(group, (err, createdGroup) => {
        if ( err ) {
          reject(err);
        } else {
          resolve(createdGroup);
        }
      });
    });
  },

  uploadImage(group) {
    return new Promise((resolve) => {
      if ( this.state.image ) {
        AwsAPI.uploadGroupImage(this.state.image, group.id).then(() => {
          resolve(group);
        }).catch(() => {
          resolve();
        });
      } else {
        resolve(group);
      }
    });
  },

  handleSubmit(evt) {
    const group = {
      title: this.state.title,
      description: this.state.description,
      tags: this.state.privacy === 'public' ? this.state.tags : [],
      privacy: this.state.privacy,
      inviteLevel: this.state.inviteLevel
    };

    evt.stopPropagation();
    evt.preventDefault();

    this.createGroup(group).then(this.uploadImage).then((createdGroup) => {
      this.history.pushState(null, `/group/${createdGroup.slug}`);
    }).catch(err => {
      this.setState({ loading: false, error: err });
    });
  },

  renderTagInput() {
    const tagLabelClasses = cx({ 'active': this.state.focusedInput === 'tags' });

    if ( this.state.privacy !== 'private' ) {
      return (
        <div className="input-container">
          <label htmlFor="tags" className={tagLabelClasses}>Tags</label>
          <div className="input">
            <TagInput onChange={this.handleTagsChange}
                      placeholder="Group tags" />
          </div>
        </div>
      );
    }
  },

  renderInviteLevelSelect() {
    const inviteLevelLabelClasses = cx({ 'active': this.state.focusedInput === 'invite-level' });

    if ( this.state.privacy !== 'public' ) {
      return (
        <div className="input-container">
          <label htmlFor="invite-level" className={inviteLevelLabelClasses}>Invite Level</label>
          <div className="input">
            <select ref="inviteLevelSelect"
                    id="invite-level"
                    value={this.state.inviteLevel}
                    onChange={this.handleInviteLevelChange}
                    required>
              <option value="1">Member</option>
              <option value="2">Admin</option>
              <option value="3">Owner</option>
            </select>
          </div>
        </div>
      );
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

  render() {
    const titleLabelClasses = cx({ 'active': this.state.focusedInput === 'title' });
    const descriptionLabelClasses = cx({ 'active': this.state.focusedInput === 'description' });
    const imageLabelClasses = cx({ 'active': this.state.focusedInput === 'image-url' });
    const privacyLabelClasses = cx({ 'active': this.state.focusedInput === 'privacy' });
    const buttonChild = this.state.loading ? <Spinner size={10} /> : <span>Create Group</span>;

    return (
      <DocumentTitle title={Helpers.buildPageTitle('Create a Group')}>
      <section className="content create-group fx-4 max-width-wrapper">

        <form ref="form" id="create-group-form" className="full-page narrow" onSubmit={this.handleSubmit}>
          <Title icon="plus" text="Create a group" />
          <div className="table-container nudge-half--bottom">
            <div className="input-container">
              <label htmlFor="title" className={titleLabelClasses}>
                Name
                <span className="red">*</span>
              </label>
              <div className="input">
                <input ref="titleInput"
                       type="text"
                       id="title"
                       value={this.state.title}
                       onChange={this.handleTitleChange}
                       placeholder="Title"
                       required />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="description" className={descriptionLabelClasses}>Description</label>
              <div className="input">
                <input ref="descriptionInput"
                       type="text"
                       id="description"
                       value={this.state.description}
                       onChange={this.handleDescriptionChange}
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
                <select ref="privacySelect"
                        id="privacy"
                        value={this.state.privacy}
                        onChange={this.handlePrivacyChange}
                        required>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            {this.renderTagInput()}

            {this.renderInviteLevelSelect()}
          </div>

          {this.renderError()}

          <div className="submit-container">
            <button ref="submitButton"
                   type="submit"
                   className="btn full"
                   disabled={this.state.loading || this.isFormInvalid()}>
              {buttonChild}
            </button>
          </div>
        </form>

      </section>
      </DocumentTitle>
    );
  }

});

export default CreateGroupPage;
