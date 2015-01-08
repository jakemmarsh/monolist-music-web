/**
 * @jsx React.DOM
 */
 'use strict';

var React    = require('react/addons');
var _        = require('lodash');

var ListLink = require('./ListLink');

var NavigationSidebar = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {}
    };
  },

  renderProfileLink: function() {
    var element = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
        <ListLink to="Profile" params={{ username: this.props.currentUser.username }}>
          <div className="icon-container">
            <i className="fa fa-user"></i>
          </div>
          <div className="text-container">
            My Profile
          </div>
        </ListLink>
      );
    }

    return element;
  },

  render: function() {
    return (
      <nav className="sidebar left">

        <ul>
          <ListLink to="CreatePlaylist">
            <div className="icon-container">
              <i className="fa fa-plus"></i>
            </div>
            <div className="text-container">
              Create Playlist
            </div>
          </ListLink>

          <ListLink to="Playlists">
            <div className="icon-container">
              <i className="fa fa-list"></i>
            </div>
            <div className="text-container">
              My Playlists
            </div>
          </ListLink>

          <ListLink to="Explore">
            <div className="icon-container">
              <i className="fa fa-compass"></i>
            </div>
            <div className="text-container">
              Explore
            </div>
          </ListLink>

          <ListLink to="TrackSearch">
            <div className="icon-container">
              <i className="fa fa-search"></i>
            </div>
            <div className="text-container">
              Search Tracks
            </div>
          </ListLink>

          {this.renderProfileLink()}

          <ListLink to="Settings">
            <div className="icon-container">
              <i className="fa fa-cogs"></i>
            </div>
            <div className="text-container">
              Account Settings
            </div>
          </ListLink>
        </ul>

        <div className="shadow" />

      </nav>
    );
  }

});

module.exports = React.createFactory(NavigationSidebar);