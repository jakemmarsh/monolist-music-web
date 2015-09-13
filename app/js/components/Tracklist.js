'use strict';

import React from 'react/addons';
import _     from 'lodash';
import $     from 'jquery';
import cx    from 'classnames';

import Track from './Track';

var Tracklist = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    userIsCreator: React.PropTypes.bool,
    userIsCollaborator: React.PropTypes.bool,
    playlist: React.PropTypes.object,
    type: React.PropTypes.string,
    currentTrack: React.PropTypes.object,
    filter: React.PropTypes.string,
    isUpvoted: React.PropTypes.bool,
    isDownvoted: React.PropTypes.bool,
    addToPlaylist: React.PropTypes.func,
    selectTrack: React.PropTypes.func,
    upvoteTrack: React.PropTypes.func,
    downvoteTrack: React.PropTypes.func,
    shouldRenderAddButton: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      userIsCreator: false,
      userIsCollaborator: false,
      playlist: {},
      filter: '',
      shouldRenderAddButton: false
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
    let $thisElement = $(this.getDOMNode());

    newMinHeight = (newMinHeight !== undefined) ? newMinHeight : $thisElement.height();

    $thisElement.css({
      'min-height': newMinHeight
    });
  },

  filterTracks: function(tracks, query) {
    let regex = new RegExp(query, 'i');

    return _.filter(tracks, function(track) {
      return regex.test(track.title) || regex.test(track.artist);
    });
  },

  trackIsActive: function(track) {
    return this.props.currentTrack && this.props.currentTrack.sourceParam === track.sourceParam;
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
             shouldRenderAddButton={this.props.shouldRenderAddButton}
             key={index} />
    );
  },

  renderTracks: function() {
    let filteredTracks = this.filterTracks(this.props.playlist.tracks, this.props.filter);
    let trackElements = null;

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
    let classes = cx({
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

export default Tracklist;