'use strict';

import React              from 'react';
import LinkedStateMixin   from 'react-addons-linked-state-mixin';
import _                  from 'lodash';
import $                  from 'jquery';
import {History}          from 'react-router';
import cx                 from 'classnames';
import DocumentTitle      from 'react-document-title';

import LoggedInRouteMixin from '../mixins/LoggedInRouteMixin';
import PlaylistActions    from '../actions/PlaylistActions';
import Helpers            from '../utils/Helpers';
import AwsAPI             from '../utils/AwsAPI';
import Title              from '../components/Title';
import FileInput          from '../components/FileInput';
import TagInput           from '../components/TagInput';
import Spinner            from '../components/Spinner';

const CreatePlaylistPage = React.createClass({

  mixins: [History, LinkedStateMixin, LoggedInRouteMixin],

  statics: {
    group: null
  },

  propTypes: {
    currentUser: React.PropTypes.object
  },

  getInitialState() {
    return {
      title: '',
      image: null,
      privacy: 'public',
      focusedInput: null,
      loading: false,
      submitDisabled: true,
      error: null
    };
  },

  componentDidMount() {
    let component = this;

    $('#create-playlist-form input').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $('#create-playlist-form input').blur(function() {
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
    return new Promise((resolve, reject) => {
      if ( this.state.image ) {
        AwsAPI.uploadPlaylistImage(this.state.image, playlist.id).then(() => {
          resolve(playlist);
        }).catch(err => {
          console.log('error uploading playlist image:', err);
          resolve();
        });
      } else {
        resolve(playlist);
      }
    });
  },

  handleSubmit(evt) {
    const playlist = {
      title: this.state.title,
      tags: this.refs.tagInput.getTokens(),
      privacy: this.state.privacy,
      ownerId: CreatePlaylistPage.group ? CreatePlaylistPage.group.id : this.props.currentUser.id,
      ownerType: CreatePlaylistPage.group ? 'group' : 'user'
    };

    evt.stopPropagation();
    evt.preventDefault();

    this.createPlaylist(playlist).then(this.uploadImage).then(createdPlaylist => {
      CreatePlaylistPage.group = null;
      this.history.pushState(null, `/playlist/${createdPlaylist.slug}`);
    }).catch(err => {
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
            <select ref="privacySelect" id="privacy" valueLink={this.linkState('privacy')} required>
              <option value="public">Public</option>
              <option value="private">Private</option>
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
    const imageLabelClasses = cx({ 'active': this.state.focusedInput === 'image-url' });
    const tagLabelClasses = cx({ 'active': _.contains(this.state.focusedInput, 'tokenfield') });
    const titleText = `Creating a playlist as: ${CreatePlaylistPage.group ? CreatePlaylistPage.group.title : this.props.currentUser.username}`;

    return (
      <DocumentTitle title={Helpers.buildPageTitle('Create a Playlist')}>
      <section className="content create-playlist">

        <form id="create-playlist-form" className="full-page narrow" onSubmit={this.handleSubmit}>
          <Title icon="plus" text={titleText} />
          <div className="table-container">
            <div className="input-container">
              <label htmlFor="title" className={titleLabelClasses}>Title</label>
              <div className="input">
                <input ref="titleInput"
                       type="text" id="title"
                       valueLink={this.linkState('title')}
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

            <div className="input-container">
              <label htmlFor="tags" className={tagLabelClasses}>Tags</label>
              <div className="input">
                <TagInput ref="tagInput"
                          placeholder="Playlist tags" />
              </div>
            </div>

            {this.renderPrivacyInput()}
          </div>

          {this.renderError()}

          {this.renderSpinner()}

          <div className="submit-container">
            <input ref="submitButton"
                   type="submit"
                   className="btn full"
                   value="Create Playlist"
                   disabled={this.state.submitDisabled ? 'true' : ''} />
          </div>
        </form>

      </section>
      </DocumentTitle>
    );
  }

});

export default CreatePlaylistPage;