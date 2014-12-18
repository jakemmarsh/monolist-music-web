/**
 * @jsx React.DOM
 */
 'use strict';

var React     = require('react/addons');
var _         = require('lodash');
var ListLink  = require('./ListLink');

var NavigationSidebar = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {}
    };
  },

  renderCreateLink: function() {
    var element = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
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

    return element;
  },

  renderPlaylistsLink: function() {
    var element = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
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

    return element;
  },

  render: function() {
    return (
      <nav className="sidebar left">

        <ul>
          {this.renderCreateLink()}

          {this.renderPlaylistsLink()}

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

module.exports = React.createFactory(NavigationSidebar);