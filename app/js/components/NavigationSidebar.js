'use strict';

import React    from 'react/addons';
import _        from 'lodash';

import ListLink from './ListLink';

var NavigationSidebar = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      currentUser: {}
    };
  },

  renderMyPlaylistsLink() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <ListLink to="Playlists">
          <div className="icon-container">
            <i className="fa fa-list"></i>
          </div>
          <div className="text-container">
            My Playlists
          </div>
        </ListLink>
      );
    }
  },

  renderCreatePlaylistLink() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <ListLink to="CreatePlaylist">
          <div className="icon-container">
            <i className="fa fa-plus"></i>
          </div>
          <div className="text-container">
            Create Playlist
          </div>
        </ListLink>
      );
    }
  },

  renderCreateGroupLink() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <ListLink to="CreateGroup">
          <div className="icon-container">
            <i className="fa fa-user-plus"></i>
          </div>
          <div className="text-container">
            Create Group
          </div>
        </ListLink>
      );
    }
  },

  render() {
    return (
      <nav className="sidebar left">

        <ul>
          <ListLink to="Explore">
            <div className="icon-container">
              <i className="fa fa-compass"></i>
            </div>
            <div className="text-container">
              Explore
            </div>
          </ListLink>

          {this.renderMyPlaylistsLink()}

          {this.renderCreatePlaylistLink()}

          <ListLink to="Groups">
            <div className="icon-container">
              <i className="fa fa-users"></i>
            </div>
            <div className="text-container">
              Groups
            </div>
          </ListLink>

          {this.renderCreateGroupLink()}

          <ListLink to="TrackSearch">
            <div className="icon-container">
              <i className="fa fa-search"></i>
            </div>
            <div className="text-container">
              Search Tracks
            </div>
          </ListLink>
        </ul>

        <div className="shadow" />

      </nav>
    );
  }

});

export default NavigationSidebar;