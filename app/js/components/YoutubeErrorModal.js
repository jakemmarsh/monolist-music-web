'use strict';

import React              from 'react';

import PermissionsHelpers from '../utils/PermissionsHelpers';
import PlaylistActions    from '../actions/PlaylistActions';
import PlaybackActions    from '../actions/PlaybackActions';
import GlobalActions      from '../actions/GlobalActions';
import Title              from './title';

const YouTubeErrorModal = React.createClass({
  propTypes: {
    message: React.PropTypes.string.isRequired,
    currentTrack: React.PropTypes.object.isRequired,
    currentPlaylist: React.PropTypes.object,
    currentUser: React.PropTypes.object
  },

  handleDeletePlaylist() {
    PlaylistActions.removeTrack(this.props.currentPlaylist, this.props.currentTrack, this.closeModal);
  },

  renderDeleteButton() {
    if ( PermissionsHelpers.isUserPlaylistCollaborator(this.props.currentPlaylist, this.props.currentUser) ) {
      return (
        <button ref="deleteButton" type="button" className="btn red nudge-half--right" onClick={this.handleDeletePlaylist}>
          Delete from playlist
        </button>
      );
    }
  },

  closeModal() {
    PlaybackActions.nextTrack();
    GlobalActions.closeModal();
  },

  render() {
    return (
      <div>
        <Title icon="exclamation" text="That video could not be played" className="flush--bottom" />
        <p ref="message" className="flush--top nudge--bottom text-left">
          {this.props.message}
        </p>
        <div className="text-right">
          {this.renderDeleteButton()}
          <button ref="dismissButton" type="button" className="btn" onClick={this.closeModal}>
            Got it
          </button>
        </div>
      </div>
    );
  }
});

export default YouTubeErrorModal;
