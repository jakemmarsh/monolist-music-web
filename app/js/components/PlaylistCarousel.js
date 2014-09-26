/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var _     = require('underscore');

var PlaylistCarousel = React.createClass({

  propTypes: {
    playlists: React.PropTypes.array.isRequired
  },

  getDefaultProps: function() {
    return {
      playlists: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    };
  },

  renderPlaylists: function() {
    var playlistElements = _.map(this.props.playlists, function(playlist, index) {
      return (
        <div className="playlist" key={index}>
          Playlist
        </div>
      );
    });

    return playlistElements;
  },

  render: function() {
    return (
      <div className="playlist-carousel-container">
        <div className="scrolling-table">
          {this.renderPlaylists()}
        </div>
      </div>
    );
  }

});

module.exports = PlaylistCarousel;