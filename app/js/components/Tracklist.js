/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react/addons');
var _                   = require('underscore');
var $                   = require('jquery');

var Track               = require('./Track');

var Tracklist = React.createClass({

  propTypes: {
    tracks: React.PropTypes.array.isRequired,
    currentTrack: React.PropTypes.object,
    filter: React.PropTypes.string,
    isUpvoted: React.PropTypes.bool,
    isDownvoted: React.PropTypes.bool,
    selectTrack: React.PropTypes.func,
    upvoteTrack: React.PropTypes.func,
    downvoteTrack: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      filter: ''
    };
  },

  componentWillUpdate: function(nextProps) {
    // Reset minimum height if it's not just being filtered on
    if ( nextProps.filter === this.props.filter ) {
      this.updateMinHeight(0);
    }
  },

  componentDidUpdate: function() {
    // Set minimum height to prevent page jump on filter
    this.updateMinHeight();
  },

  updateMinHeight: function(newMinHeight) {
    var $thisElement = $(this.getDOMNode());

    newMinHeight = (newMinHeight !== undefined) ? newMinHeight : $thisElement.height();

    $thisElement.css({
      'min-height': newMinHeight
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
        // TODO: better logic to determine if active?
        isActive = (this.props.currentTrack && this.props.currentTrack.sourceParam === track.sourceParam);
        return (
          <Track type={this.props.type}
                 track={track}
                 isActive={isActive}
                 isUpvoted={true}
                 isDownvoted={false}
                 selectTrack={this.props.selectTrack.bind(null, track, index, this.props.type)}
                 upvoteTrack={this.props.upvoteTrack ? this.props.upvoteTrack.bind(null, track) : null}
                 downvoteTrack={this.props.downvoteTrack ? this.props.downvoteTrack.bind(null, track) : null}
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