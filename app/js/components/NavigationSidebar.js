'use strict';

import React    from 'react/addons';
import _        from 'lodash';

import ListLink from './ListLink';
import navLinks from '../data/nav_links';

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
            <i className="icon-list"></i>
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
            <i className="icon-plus"></i>
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
            <i className="icon-user-plus"></i>
          </div>
          <div className="text-container">
            Create Group
          </div>
        </ListLink>
      );
    }
  },

  renderLinks() {
    return _.map(navLinks, (link, index) => {
      if ( !link.requiresUser || !_.isEmpty(this.props.currentUser) ) {
        return (
          <ListLink to={link.path} key={index}>
            <div className="icon-container">
              <i className={'fa ' + link.icon}></i>
            </div>
            <div className="text-container">
              {link.text}
            </div>
          </ListLink>
        );
      }
    });
  },

  render() {
    return (
      <nav className="sidebar left">

        <ul>
          {this.renderLinks()}
        </ul>

        <div className="shadow" />

      </nav>
    );
  }

});

export default NavigationSidebar;