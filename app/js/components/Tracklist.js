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
    currentUser: React.PropTypes.object.isRequired,
    playlist: React.PropTypes.object.isRequired,
    type: React.PropTypes.string.isRequired,
    currentTrack: React.PropTypes.object,
    filter: React.PropTypes.string,
    isUpvoted: React.PropTypes.bool,
    isDownvoted: React.PropTypes.bool,
    addToPlaylist: React.PropTypes.func,
    selectTrack: React.PropTypes.func,
    upvoteTrack: React.PropTypes.func,
    downvoteTrack: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      playlist: {},
      filter: ''
    };
  },

  componentWillUpdate: function(nextProps) {
    if ( this.props.playlist.tracks && nextProps.playlist.tracks.length < this.props.playlist.tracks.length ) {
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

  userIsCollaborator: function() {
    var isCreator = this.props.playlist.userId === this.props.currentUser.id;
    var isCollaborator = !!_.where(this.props.playlist.collaborations, { userId: this.props.currentUser.id }).length;

    if ( this.props.type === 'playlist' ) {
      return isCreator || isCollaborator;
    }

    return false;
  },

  trackIsActive: function(track) {
    var isActive;

    if ( this.props.type === 'search' ) {
      isActive = this.props.currentTrack && this.props.currentTrack.sourceParam === track.sourceParam;
    } else {
      isActive = this.props.currentTrack && this.props.currentTrack.id === track.id;
    }

    return isActive;
  },

  renderTracks: function() {
    var filteredTracks = this.filterTracks(this.props.playlist.tracks, this.props.filter);
    var trackElements;

    if ( filteredTracks ) {
      trackElements = _.map(filteredTracks, function(track, index) {

        // TODO: determine isUpvoted/isDownvoted dynamically
        return (
          <Track type={this.props.type}
                 track={track}
                 index={index}
                 currentUser={this.props.currentUser}
                 userIsCollaborator={this.userIsCollaborator()}
                 isActive={this.trackIsActive(track)}
                 showContextMenu={this.props.showContextMenu ? this.props.showContextMenu : null}
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

module.exports = React.createFactory(Tracklist);