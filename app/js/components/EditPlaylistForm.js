'use strict';

import React            from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import cx               from 'classnames';
import $                from 'jquery';

import PlaylistActions  from '../actions/PlaylistActions';
import GlobalActions    from '../actions/GlobalActions';
import Spinner          from './Spinner';
import Title            from './Title';

const EditPlaylistForm = React.createClass({

  mixins: [LinkedStateMixin],

  propTypes: {
    playlist: React.PropTypes.object
  },

  getInitialState() {
    return {
      error: null,
      loading: false,
      changesSaved: false,
      title: this.props.playlist.title,
      privacy: this.props.playlist.privacy
    };
  },

  componentDidMount() {
    const component = this;

    $('#edit-playlist-form input').focus(function() {
      component.setState({ focusedInput: $(this).attr('id') });
    });

    $('#edit-playlist-form input').blur(function() {
      component.setState({ focusedInput: null });
    });
  },

  componentWillReceiveProps(nextProps) {
    if ( this.props.playlist.id !== nextProps.playlist.id ) {
      this.setState({
        title: nextProps.playlist.title,
        privacy: nextProps.playlist.privacy
    });
    }
  },

  formIsInvalid() {
    const hasNewTitle = this.state.title.length && this.state.title !== this.props.playlist.title;
    const hasNewPrivacy = this.state.privacy.length && this.state.privacy !== this.props.playlist.privacy;

    return !hasNewTitle && !hasNewPrivacy;
  },

  handleSubmit(evt) {
    const hasNewTitle = this.state.title.length && this.state.title !== this.props.playlist.title;
    const hasNewPrivacy = this.state.privacy.length && this.state.privacy !== this.props.playlist.privacy;
    const updates = {};

    evt.preventDefault();

    if ( hasNewTitle ) { updates.title = this.state.title; }
    if ( hasNewPrivacy ) { updates.privacy = this.state.privacy; }

    this.setState({
      error: null,
      loading: true,
      changesSaved: false
    });

    PlaylistActions.update(this.props.playlist.id, updates, (err) => {
      console.log('update callback:', err);
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

  renderSuccessMessage() {
    if ( this.state.changesSaved ) {
      return (
        <span className="highlight text-right">
          Changes saved.
        </span>
      );
    }
  },

  render() {
    const titleLabelClasses = cx({ 'active': this.state.focusedInput === 'title' });
    const privacyLabelClasses = cx({ 'active': this.state.focusedInput === 'privacy' });

    return (
      <form id="edit-playlist-form" className="full-page" onSubmit={this.handleSubmit}>

        <Title icon="cog" text={`Edit ${this.props.playlist.title}`} className="flush--bottom" />

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
        </div>

        <div className="text-right">
          {this.renderError()}
          {this.renderSpinner()}
          {this.renderSuccessMessage()}
          <button type="submit" className="btn nudge-half--sides" disabled={this.state.loading || this.formIsInvalid() ? 'true' : ''}>
            Save Changes
          </button>
          <button type="button" className="btn red" onClick={GlobalActions.closeModal}>
            Cancel
          </button>
        </div>

      </form>
    );
  }

});

export default EditPlaylistForm;
