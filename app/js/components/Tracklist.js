/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react/addons');
var _                   = require('lodash');
var $                   = require('jquery');
var cx                  = React.addons.classSet;

var Track               = require('./Track');

var Tracklist = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    userIsCreator: React.PropTypes.bool,
    userIsCollaborator: React.PropTypes.bool,
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
      userIsCreator: false,
      userIsCollaborator: false,
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

  trackIsActive: function(track) {
    var isActive;

    if ( this.props.type === 'search' ) {
      isActive = this.props.currentTrack && this.props.currentTrack.sourceParam === track.sourceParam;
    } else {
      isActive = this.props.currentTrack && this.props.currentTrack.id === track.id;
    }

    return isActive;
  },

  createTrackElement: function(track, index) {
    return (
      <Track type={this.props.type}
             track={track}
             index={index}
             currentUser={this.props.currentUser}
             userIsCreator={this.props.userIsCreator}
             userIsCollaborator={this.props.userIsCollaborator}
             isActive={this.trackIsActive(track)}
             playlist={this.props.playlist}
             showContextMenu={this.props.showContextMenu}
             key={index} />
    );
  },

  renderTracks: function() {
    var filteredTracks = this.filterTracks(this.props.playlist.tracks, this.props.filter);
    var trackElements = null;

    if ( this.props.type === 'playlist' && filteredTracks ) {
      trackElements = _.chain(filteredTracks)
        .sortBy(function(track) { return track.createdAt; })
        .map(function(track, index) {
          return this.createTrackElement(track, index);
        }.bind(this));
    } else if ( filteredTracks ) {
      trackElements = _.map(filteredTracks, function(track, index) {
        return this.createTrackElement(track, index);
      }.bind(this));
    }

    return trackElements;
  },

  render: function() {
    var classes = cx({
      'tracklist': true,
      'has-control-bar': this.props.type === 'playlist'
    });

    return (
      <ul className={classes}>
        {this.renderTracks()}
      </ul>
    );
  }

});

module.exports = React.createFactory(Tracklist);