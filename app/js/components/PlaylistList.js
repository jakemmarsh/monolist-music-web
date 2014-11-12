/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var _            = require('underscore');

var PlaylistLink = require('./PlaylistLink');

var PlaylistList = React.createClass({

  propTypes: {
    playlists: React.PropTypes.array.isRequired
  },

  getDefaultProps: function() {
    return {
      playlists: []
    };
  },

  renderPlaylists: function() {
    var elements = null;

    if ( this.props.playlists && this.props.playlists.length ) {
    elements = _.map(this.props.playlists, function(playlist, index) {
      return (
        <li key={index}>
          <PlaylistLink playlist={playlist} />
        </li>
      );
    });
    } else {
      elements = (
        <h3 className="no-playlists">No playlists yet!</h3>
      );
    }

    return elements;
  },

  render: function() {
    return (
      <ul className="playlist-list">

        {this.renderPlaylists()}

      </ul>
    );
  }

});

module.exports = React.createFactory(PlaylistList);