'use strict';

import React                   from 'react/addons';
import _                       from 'lodash';
import $                       from 'jquery';
import {Navigation}            from 'react-router';
import cx                      from 'classnames';
import DocumentTitle           from 'react-document-title';

import AuthenticatedRouteMixin from '../mixins/AuthenticatedRouteMixin';
import PlaylistActions         from '../actions/PlaylistActions';
import APIUtils                from '../utils/APIUtils';
import AwsAPI                  from '../utils/AwsAPI';
import FileInput               from '../components/FileInput';
import TagInput                from '../components/TagInput';
import Spinner                 from '../components/Spinner';

var CreatePlaylistPage = React.createClass({

  mixins: [Navigation, React.addons.LinkedStateMixin, AuthenticatedRouteMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
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
    var component = this;

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
    var playlist = {
      title: this.state.title,
      tags: this.refs.tagInput.getTokens(),
      privacy: this.state.privacy
    };

    evt.stopPropagation();
    evt.preventDefault();

    this.createPlaylist(playlist).then(this.uploadImage).then(createdPlaylist => {
      this.transitionTo('Playlist', { slug: createdPlaylist.slug });
    }).catch(err => {
      this.setState({ loading: false, error: err.message });
    });
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
    var titleLabelClasses = cx({ 'active': this.state.focusedInput === 'title' });
    var imageLabelClasses = cx({ 'active': this.state.focusedInput === 'image-url' });
    var tagLabelClasses = cx({ 'active': _.contains(this.state.focusedInput, 'tokenfield') });
    var privacyLabelClasses = cx({ 'active': this.state.focusedInput === 'privacy' });

    return (
      <DocumentTitle title={APIUtils.buildPageTitle('Create Playlist')}>
      <section className="content create-playlist">

        <form id="create-playlist-form" className="full-page narrow" onSubmit={this.handleSubmit}>
          <div className="table-container">
            <div className="input-container">
              <label htmlFor="title" className={titleLabelClasses}>Title</label>
              <div className="input">
                <input type="text" id="title" valueLink={this.linkState('title')} placeholder="Title" required />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="image-url" className={imageLabelClasses}>Cover Image</label>
              <div className="input">
                <FileInput id="image-url" accept="image/x-png, image/gif, image/jpeg" processFile={this.updateImage} />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="tags" className={tagLabelClasses}>Tags</label>
              <div className="input">
                <TagInput ref="tagInput" placeholder="Playlist tags" />
              </div>
            </div>

            <div className="input-container">
              <label htmlFor="privacy" className={privacyLabelClasses}>Privacy</label>
              <div className="input">
                <select id="privacy" valueLink={this.linkState('privacy')} required>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>

          {this.renderError()}

          {this.renderSpinner()}

          <div className="submit-container">
            <input type="submit" className="btn full" value="Create Playlist" disabled={this.state.submitDisabled ? 'true' : ''} />
          </div>
        </form>

      </section>
      </DocumentTitle>
    );
  }

});

export default CreatePlaylistPage;