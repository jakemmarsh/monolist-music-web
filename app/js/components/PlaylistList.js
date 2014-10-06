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

  renderPlaylists: function() {
    var elements = null;

    elements = _.map(this.props.playlists, function(playlist, index) {
      return (
        <li key={index}>
          <PlaylistLink playlist={playlist} />
        </li>
      );
    });

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

module.exports = PlaylistList;