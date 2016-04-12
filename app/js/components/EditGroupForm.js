'use strict';

import React               from 'react';
import LinkedStateMixin    from 'react-addons-linked-state-mixin';
import cx                  from 'classnames';
import _                   from 'lodash';

import LabelHighlightMixin from '../mixins/LabelHighlightMixin';
import GroupActions        from '../actions/GroupActions';
import GlobalActions       from '../actions/GlobalActions';
import Spinner             from './Spinner';
import Title               from './Title';
import TagInput            from './TagInput';

const EditGroupForm = React.createClass({

  mixins: [LinkedStateMixin, LabelHighlightMixin],

  propTypes: {
    group: React.PropTypes.object
  },

  getInitialState() {
    return {
      error: null,
      loading: false,
      changesSaved: false,
      title: this.props.group.title,
      description: this.props.group.description,
      privacy: this.props.group.privacy,
      tags: this.props.group.tags
    };
  },

  componentWillReceiveProps(nextProps) {
    if ( this.props.group.id !== nextProps.group.id ) {
      this.setState({
        title: nextProps.group.title,
        description: nextProps.group.description,
        privacy: nextProps.group.privacy,
        tags: nextProps.group.tags
    });
    }
  },

  formIsInvalid() {
    const hasNewTitle = this.state.title.length && this.state.title !== this.props.group.title;
    const hasNewDescription = this.state.description && this.state.description !== this.props.group.description;
    const hasNewPrivacy = this.state.privacy.length && this.state.privacy !== this.props.group.privacy;
    const hasNewTags = !_.isEqual(this.state.tags, this.props.group.tags);

    return !hasNewTitle && !hasNewDescription && !hasNewPrivacy && !hasNewTags;
  },

  handleTagsChange(tags) {
    this.setState({ tags: tags });
  },

  handleSubmit(evt) {
    const hasNewTitle = this.state.title.length && this.state.title !== this.props.group.title;
    const hasNewDescription = this.state.description && this.state.description !== this.props.group.description;
    const hasNewPrivacy = this.state.privacy.length && this.state.privacy !== this.props.group.privacy;
    const hasNewTags = !_.isEqual(this.state.tags, this.props.group.tags);
    const updates = {};

    evt.preventDefault();

    if ( hasNewTitle ) { updates.title = this.state.title; }

    if ( hasNewDescription ) { updates.description = this.state.description; }

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

    GroupActions.update(this.props.group.id, updates, (err) => {
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
        <div>
          <button type="submit" className="btn nudge-half--sides" disabled={this.state.loading || this.formIsInvalid() ? 'true' : ''}>
            Save Changes
          </button>
          <button type="button" className="btn red" onClick={GlobalActions.closeModal}>
            Cancel
          </button>
        </div>
      );
    }

    return element;
  },

  render() {
    const titleLabelClasses = cx({ 'active': this.state.focusedInput === 'title' });
    const descriptionLabelClasses = cx({ 'active': this.state.focusedInput === 'description' });
    const privacyLabelClasses = cx({ 'active': this.state.focusedInput === 'privacy' });

    return (
      <form id="edit-group-form" className="full-page" onSubmit={this.handleSubmit}>

        <Title icon="cog" text={`Edit ${this.props.group.title}`} className="flush--bottom" />

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
            <label htmlFor="description" className={descriptionLabelClasses}>Description</label>
            <div className="input">
              <input ref="descriptionInput"
                     type="text"
                     id="description"
                     valueLink={this.linkState('description')}
                     placeholder="Description" />
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

export default EditGroupForm;
