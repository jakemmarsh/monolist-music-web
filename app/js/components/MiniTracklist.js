/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var _     = require('lodash');

var MiniTracklist = React.createClass({

  propTypes: {
    tracks: React.PropTypes.array.isRequired
  },

  getDefaultProps: function() {
    return {
      tracks: []
    };
  },

  renderStarredTracks: function() {
    return _.map(this.props.tracks, function(track, index) {
      return (
        <li className="mini-track islet" key={index} />
      );
    });
  },

  render: function() {
    return (
      <ul className="mini-tracklist">
        {this.renderStarredTracks()}
      </ul>
    );
  }

});

module.exports = React.createFactory(MiniTracklist);