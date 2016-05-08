'use strict';

import React               from 'react';
import {History}           from 'react-router';
import cx                  from 'classnames';
import DocumentTitle       from 'react-document-title';

import LoggedInRouteMixin  from '../mixins/LoggedInRouteMixin';
import LabelHighlightMixin from '../mixins/LabelHighlightMixin';
import PlaylistActions     from '../actions/PlaylistActions';
import Helpers             from '../utils/Helpers';
import AwsAPI              from '../utils/AwsAPI';
import Title               from '../components/Title';
import FileInput           from '../components/FileInput';
import TagInput            from '../components/TagInput';
import Spinner             from '../components/Spinner';

const CreatePlaylistPage = React.createClass({

  mixins: [History, LoggedInRouteMixin, LabelHighlightMixin],

  statics: {
    group: null
  },

  propTypes: {
    currentUser: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      currentUser: {}
    };
  },

  getInitialState() {
    return {
      title: '',
      image: null,
      tags: [],
      privacy: 'public',
      focusedInput: null,
      loading: false,
      error: null
    };
  },


  componentWillUnmount() {
    CreatePlaylistPage.group = null;
  },

  isFormInvalid() {
    return !this.state.title || !this.state.title.length;
  },

  updateImage(image) {
    this.setState({
      image: image
    });
  },

  handleTitleChange(evt) {
    this.setState({
      title: evt.target.value
    });
  },

  handlePrivacyChange(evt) {
    this.setState({
      privacy: evt.target.value
    });
  },

  handleTagsChange(tags) {
    this.setState({
      tags: tags
    });
  },

  createPlaylist(playlist) {
    return new Promise((resolve, reject) => {
      this.setState({ loading: true });

      PlaylistActions.create(playlist, (err, createdPlaylist) => {
        if ( err ) {
          reject(err);
        } else {
          resolve(createdPlaylist);
        }
      });
    });
  },

  uploadImage(playlist) {
    return new Promise((resolve) => {
      if ( this.state.image ) {
        AwsAPI.uploadPlaylistImage(this.state.image, playlist.id).then(() => {
          resolve(playlist);
        }).catch(() => {
          // Still resolve since playlist was successfully created
          resolve(playlist);
        });
      } else {
        resolve(playlist);
      }
    });
  },

  handleSubmit(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const playlist = {
      title: this.state.title,
      tags: this.state.privacy === 'public' ? this.state.tags : [],
      privacy: this.state.privacy,
      ownerId: CreatePlaylistPage.group ? CreatePlaylistPage.group.id : this.props.currentUser.id,
      ownerType: CreatePlaylistPage.group ? 'group' : 'user'
    };

    this.createPlaylist(playlist).then(this.uploadImage).then((createdPlaylist) => {
      this.history.pushState(null, `/playlist/${createdPlaylist.slug}`);
    }).catch((err) => {
      this.setState({ loading: false, error: err });
    });
  },

  renderPrivacyInput() {
    const privacyLabelClasses = cx({ 'active': this.state.focusedInput === 'privacy' });

    if ( CreatePlaylistPage.group === null ) {
      return (
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
      );
    }
  },

  renderTagInput() {
    const tagLabelClasses = cx({ 'active': this.state.focusedInput === 'tags' });

    if ( this.state.privacy !== 'private' ) {
      return (
        <div className="input-container">
          <label htmlFor="tags" className={tagLabelClasses}>Tags</label>
          <div className="input">
            <TagInput onChange={this.handleTagsChange}
                      placeholder="Playlist tags" />
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
    const imageLabelClasses = cx({ 'active': this.state.focusedInput === 'image-url' });
    const titleText = `Create a playlist as: ${CreatePlaylistPage.group ? CreatePlaylistPage.group.title : this.props.currentUser.username}`;

    return (
      <DocumentTitle title={Helpers.buildPageTitle('Create a Playlist')}>
      <section className="content create-playlist fx-4 max-width-wrapper">

        <form ref="form" id="create-playlist-form" className="full-page narrow" onSubmit={this.handleSubmit}>
          <Title icon="plus" text={titleText} />
          <div className="table-container nudge-half--bottom">
            <div className="input-container">
              <label htmlFor="title" className={titleLabelClasses}>
                Title
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
              <label htmlFor="image-url" className={imageLabelClasses}>Cover Image</label>
              <div className="input">
                <FileInput id="image-url"
                           accept="image/x-png, image/gif, image/jpeg"
                           processFile={this.updateImage} />
              </div>
            </div>

            {this.renderPrivacyInput()}

            {this.renderTagInput()}
          </div>

          {this.renderError()}

          {this.renderSpinner()}

          <div className="submit-container">
            <input ref="submitButton"
                   type="submit"
                   className="btn full"
                   value="Create Playlist"
                   disabled={this.state.loading || this.isFormInvalid()} />
          </div>
        </form>

      </section>
      </DocumentTitle>
    );
  }

});

export default CreatePlaylistPage;
