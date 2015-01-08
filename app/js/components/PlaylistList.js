/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var _            = require('lodash');
var MasonryMixin = require('react-masonry-mixin');

var PlaylistLink = require('./PlaylistLink');

var PlaylistList = React.createClass({

  mixins: [MasonryMixin('masonryContainer', { transitionDuration: 0, gutter: 20 })],

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

    if ( !_.isEmpty(this.props.playlists) ) {
    elements = _.map(this.props.playlists, function(playlist, index) {
      return (
        <li className="playlist-link-container" key={index}>
          <PlaylistLink playlist={playlist} />
        </li>
      );
    });
    } else {
      elements = (
        <h3 className="flush--top light">No playlists yet!</h3>
      );
    }

    return elements;
  },

  render: function() {
    return (
      <ul className="playlist-list" ref="masonryContainer">

        {this.renderPlaylists()}

      </ul>
    );
  }

});

module.exports = React.createFactory(PlaylistList);