/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react/addons');
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
      privacy: 'public'
    };
  },

  updateImageUrl: function(dataUri) {
    this.setState({
      imageUrl: dataUri
    });
  },

  handleSubmit: function() {
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
      <form className="create-playlist-form">

        <div className="input-container">
          <label htmlFor="title">Title</label>
          <input type="text" valueLink={this.linkState('title')} placeholder="Title" />
        </div>

        <div className="input-container">
          <label htmlFor="imageUrl">Cover Image URL</label>
          <FileInput processFile={this.updateImageUrl} />
        </div>

        <div className="input-container">
          <label htmlFor="privacy">Privacy</label>
          <div className="input">
            <select valueLink={this.linkState('privacy')}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div className="submit-container">
          <a onClick={this.handleSubmit} className="btn">Create Playlist</a>
        </div>

      </form>
    );
  }

});

module.exports = React.createFactory(CreatePlaylistForm);