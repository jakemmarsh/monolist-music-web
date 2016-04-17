'use strict';

import React               from 'react';
import LinkedStateMixin    from 'react-addons-linked-state-mixin';
import cx                  from 'classnames';
import _                   from 'lodash';

import LabelHighlightMixin from '../mixins/LabelHighlightMixin';
import PlaylistActions     from '../actions/PlaylistActions';
import GlobalActions       from '../actions/GlobalActions';
import Spinner             from './Spinner';
import Title               from './Title';
import TagInput            from './TagInput';

const EditPlaylistForm = React.createClass({

  mixins: [LinkedStateMixin, LabelHighlightMixin],

  propTypes: {
    playlist: React.PropTypes.object
  },

  getInitialState() {
    return {
      error: null,
      loading: false,
      changesSaved: false,
      title: this.props.playlist.title,
      privacy: this.props.playlist.privacy,
      tags: this.props.playlist.tags
    };
  },

  componentWillReceiveProps(nextProps) {
    if ( this.props.playlist.id !== nextProps.playlist.id ) {
      this.setState({
        title: nextProps.playlist.title,
        privacy: nextProps.playlist.privacy,
        tags: nextProps.playlist.tags
    });
    }
  },

  formIsInvalid() {
    const hasNewTitle = this.state.title.length && this.state.title !== this.props.playlist.title;
    const hasNewPrivacy = this.state.privacy.length && this.state.privacy !== this.props.playlist.privacy;
    const hasNewTags = !_.isEqual(this.state.tags, this.props.playlist.tags);

    return !hasNewTitle && !hasNewPrivacy && !hasNewTags;
  },

  handleTagsChange(tags) {
    this.setState({ tags: tags });
  },

  handleSubmit(evt) {
    const hasNewTitle = this.state.title.length && this.state.title !== this.props.playlist.title;
    const hasNewPrivacy = this.state.privacy.length && this.state.privacy !== this.props.playlist.privacy;
    const hasNewTags = !_.isEqual(this.state.tags, this.props.playlist.tags);
    const updates = {};

    evt.preventDefault();

    if ( hasNewTitle ) { updates.title = this.state.title; }

    if ( hasNewPrivacy ) {
      updates.privacy = this.state.privacy;

      if ( updates.privacy === 'private' ) {
        updates.tags = [];
      }
    }

    if ( updates.privacy !== 'private' && hasNewTags ) {
      updates.tags = this.state.tags;
    }

    this.setState({
      error: null,
      loading: true,
      changesSaved: false
    });

    PlaylistActions.update(this.props.playlist.id, updates, (err) => {
      if ( err ) {
        this.setState({ loading: false, error: err });
      } else {
        this.setState({
          error: null,
          loading: false,
          changesSaved: true
        });
      }
    });
  },

  renderTagInput() {
    const tagLabelClasses = cx({ 'active': this.state.focusedInput === 'tags' });

    if ( this.state.privacy !== 'private' ) {
      return (
        <div className="input-container">
          <label htmlFor="tags" className={tagLabelClasses}>Tags</label>
          <div className="input">
            <TagInput tags={this.state.tags}
                      onChange={this.handleTagsChange}
                      placeholder="Playlist tags" />
          </div>
        </div>
      );
    }
  },

  renderError() {
    if ( this.state.error ) {
      return (
        <span className="error-container text-right">
          {this.state.error || 'Error here'}
        </span>
      );
    }
  },

  renderSpinner() {
    if ( this.state.loading ) {
      return (
        <span className="spinner-container inline-block text-right">
          <Spinner size={10} />
        </span>
      );
    }
  },

  renderSuccessMessageOrActionButtons() {
    let element;

    if ( this.state.changesSaved ) {
      element = (
        <span className="highlight text-right">
          Changes saved.
        </span>
      );
    } else {
      element = (
        <span>
          <button type="submit" className="btn nudge-half--sides" disabled={this.state.loading || this.formIsInvalid() ? 'true' : ''}>
            Save Changes
          </button>
          <button type="button" className="btn red" onClick={GlobalActions.closeModal}>
            Cancel
          </button>
        </span>
      );
    }

    return element;
  },

  render() {
    const titleLabelClasses = cx({ 'active': this.state.focusedInput === 'title' });
    const privacyLabelClasses = cx({ 'active': this.state.focusedInput === 'privacy' });

    return (
      <form id="edit-playlist-form" className="full-page" onSubmit={this.handleSubmit}>

        <Title icon="edit" text={`Edit ${this.props.playlist.title}`} className="flush--bottom" />

        <div className="table-container nudge-half--bottom">
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
            <label htmlFor="privacy" className={privacyLabelClasses}>Privacy</label>
            <div className="input">
              <select ref="privacySelect" id="privacy" valueLink={this.linkState('privacy')} required>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          {this.renderTagInput()}
        </div>

        <div className="text-right">
          {this.renderError()}
          {this.renderSpinner()}
          {this.renderSuccessMessageOrActionButtons()}
        </div>

      </form>
    );
  }

});

export default EditPlaylistForm;
