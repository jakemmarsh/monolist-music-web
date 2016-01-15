'use strict';

import React from 'react';

const DeletePlaylistOption = React.createClass({

  propTypes: {
    deletePlaylist: React.PropTypes.func
  },

  getInitialState() {
    return {
      isConfirming: false
    };
  },

  doConfirmation() {
    this.setState({ isConfirming: true });
  },

  cancel() {
    this.setState({ isConfirming: false });
  },

  renderInitialOption() {
    return (
      <li onClick={this.doConfirmation}>
        <i className="icon-close"></i>
        Delete Playlist
      </li>
    );
  },

  renderConfirmation() {
    return (
      <li className="delete-confirmation">
        <span className="nudge-quarter--right">Are you sure?</span>
        <a href={null} onClick={this.props.deletePlaylist}>Yes</a>
        <span className="nudge-quarter--sides">|</span>
        <a href={null} onClick={this.cancel}>Cancel</a>
      </li>
    );
  },

  render() {
    if ( this.state.isConfirming ) {
      return this.renderConfirmation();
    } else {
      return this.renderInitialOption();
    }
  }

});

export default DeletePlaylistOption;
