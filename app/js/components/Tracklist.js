/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react/addons');
var _                   = require('underscore');
var $                   = require('jquery');

var Track               = require('./Track');

var Tracklist = React.createClass({

  getDefaultProps: function() {
    return {
      filter: ''
    };
  },

  componentDidMount: function() {
    var $thisElement = $(this.getDOMNode());

    // Set minimum height to prevent page jump on filter
    $thisElement.css({
      'min-height': $thisElement.height()
    });
  },

  filterTracks: function(tracks, query) {
    var regex = new RegExp(query, 'i');
    return _.filter(tracks, function(track) {
      return regex.test(track.title) || regex.test(track.artist);
    });
  },

  renderTracks: function() {
    var filteredTracks = this.filterTracks(this.props.tracks, this.props.filter);
    var trackElements;
    var isActive;

    if ( filteredTracks ) {
      trackElements = _.map(filteredTracks, function(track, index) {
        isActive = (this.props.currentTrack && this.props.currentTrack.id === track.id);
        return (
          <Track track={track}
                 isActive={isActive}
                 selectTrack={this.props.selectTrack}
                 key={index} />
        );
      }.bind(this));
    }

    return trackElements;
  },

  render: function() {
    return (
      <ul className="tracklist">
        {this.renderTracks()}
      </ul>
    );
  }

});

module.exports = Tracklist;