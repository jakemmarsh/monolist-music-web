'use strict';

import React    from 'react';
import _        from 'lodash';
import {Link}   from 'react-router';

var NavigationSidebar = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    userGroups: React.PropTypes.array
  },

  getDefaultProps() {
    return {
      currentUser: {}
    };
  },

  renderCreatePlaylistButton() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <div className="icon-container text-right">
          <Link to="/playlists/create"><i className="icon-plus" /></Link>
        </div>
      );
    }
  },

  renderUserCollaborations() {
    if ( !_.isEmpty(this.props.currentUser) && this.props.userCollaborations ) {
      return _.map(this.props.userCollaborations, (playlist) => {
        return (
          <li className="navigation-sub-list-item" key={playlist.slug}>
            <Link to={`/playlist/${playlist.slug}`}>{playlist.title}</Link>
          </li>
        );
      });
    }
  },

  renderCreateGroupButton() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <div className="icon-container text-right">
          <Link to="/groups/create"><i className="icon-plus" /></Link>
        </div>
      );
    }
  },

  renderUserGroups() {
    if ( !_.isEmpty(this.props.currentUser) && this.props.userGroups ) {
      return _.map(this.props.userGroups, (group) => {
        return (
          <li className="navigation-sub-list-item" key={group.slug}>
            <Link to={`/group/${group.slug}`}>{group.title}</Link>
          </li>
        );
      });
    }
  },

  render() {
    return (
      <nav className="sidebar left">

        <ul className="navigation-list">
          <li className="navigation-list-item nudge--bottom">
            <div className="list-title-container">
              <div className="icon-container">
                <i className="icon-list" />
              </div>
              <div className="text-container">
                Playlists
              </div>
              {this.renderCreatePlaylistButton()}
            </div>
            <ul className="navigation-sub-list">
              <li className="navigation-sub-list-item">
                <Link to="/playlists">Explore</Link>
              </li>
              <hr className="navigation-sub-list-hr" />
              {this.renderUserCollaborations()}
            </ul>
          </li>
          <li className="navigation-list-item nudge--bottom">
            <div className="list-title-container">
              <div className="icon-container">
                <i className="icon-group" />
              </div>
              <div className="text-container">
                Groups
              </div>
              {this.renderCreateGroupButton()}
            </div>
            <ul className="navigation-sub-list">
              <li className="navigation-sub-list-item">
                <Link to="/playlists">Explore</Link>
              </li>
              <hr className="navigation-sub-list-hr" />
              {this.renderUserGroups()}
            </ul>
          </li>
          <li className="navigation-list-item nudge--bottom">
            <div className="list-title-container">
              <div className="icon-container">
                <i className="icon-search" />
              </div>
              <div className="text-container">
                Search
              </div>
            </div>
            <ul className="navigation-sub-list">
              <li className="navigation-sub-list-item">
                <Link to="/search/playlists">Playlists</Link>
              </li>
              <li className="navigation-sub-list-item">
                <Link to="/search/tracks">Tracks</Link>
              </li>
              <li className="navigation-sub-list-item">
                <Link to="/search/Groups">Groups</Link>
              </li>
            </ul>
          </li>
        </ul>

        <div className="shadow" />

      </nav>
    );
  }

});

export default NavigationSidebar;