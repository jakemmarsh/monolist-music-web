/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react/addons');
var _               = require('underscore');
var $               = require('jquery');
var Navigation      = require('react-router').Navigation;

var GlobalActions   = require('../actions/GlobalActions');
var PlaylistActions = require('../actions/PlaylistActions');
var FileInput        = require('./FileInput');

var CreatePlaylistForm = React.createClass({

  mixins: [React.addons.LinkedStateMixin, Navigation],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      title: '',
      imageUrl: '',
      privacy: 'public',
      submitDisabled: true
    };
  },

  updateImageUrl: function(dataUri) {
  componentDidUpdate: function(prevProps, prevState) {
    if ( !_.isEqual(this.state, prevState) ) {
      this.checkForm();
    }
  },

  checkForm: function() {
    var $form = $('#create-playlist-form');
    var formIsValid = !$form.checkValidity || $form.checkValidity();

    if ( formIsValid ) {
      this.setState({ submitDisabled: false });
    } else {
      this.setState({ submitDisabled: true });
    }
  },
    this.setState({
      imageUrl: dataUri
    });
  },

  handleSubmit: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var playlist = {
      title: this.state.title,
      imageUrl: this.state.imageUrl,
      privacy: this.state.privacy
    };

    PlaylistActions.create(playlist, this.transitionToNewPlaylist);
  },

  transitionToNewPlaylist: function(playlist) {
    GlobalActions.loadUserCollaborations();
    this.transitionTo('Playlist', { id: playlist.id });
  },

  render: function() {
    return (
      <form id="create-playlist-form" className="create-playlist-form" encType="multipart/form-data" onSubmit={this.handleSubmit}>

        <div className="input-container">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" valueLink={this.linkState('title')} placeholder="Title" required />
        </div>

        <div className="input-container">
          <label htmlFor="imageUrl">Cover Image</label>
          <FileInput id="imageUrl" accept="image/x-png, image/gif, image/jpeg" processFile={this.updateImageUrl} />
        </div>

        <div className="input-container">
          <label htmlFor="privacy">Privacy</label>
          <div className="input">
            <select id="privacy" valueLink={this.linkState('privacy')} required>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div className="submit-container">
          <input type="submit" className="btn full" value="Create Playlist" disabled={this.state.submitDisabled ? 'true' : ''} />
        </div>

      </form>
    );
  }

});

module.exports = React.createFactory(CreatePlaylistForm);