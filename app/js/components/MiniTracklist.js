'use strict';

import React           from 'react/addons';
import cx              from 'classnames';
import _               from 'lodash';
import $               from 'jquery';

import Helpers         from '../utils/Helpers';
import TrackActions    from '../actions/TrackActions';
import PlaylistActions from '../actions/PlaylistActions';

var MiniTracklist = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    profileUser: React.PropTypes.object,
    tracks: React.PropTypes.array,
    currentTrack: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      curentUser: {},
      profileUser: {},
      tracks: [],
      currentTrack: {}
    };
  },

  getInitialState() {
    return {
      tracks: this.props.tracks
    };
  },

  componentWillReceiveProps(nextProps) {
    if ( !_.isEqual(this.props.tracks, nextProps.tracks) ) {
      this.setState({ tracks: nextProps.tracks });
    }
  },

  componentDidUpdate() {
    $('.track-star').hover(function() {
      $(this).removeClass('icon-star');
      $(this).addClass('icon-star-o');
    });

    $('.track-star').mouseleave(function() {
      $(this).removeClass('icon-star-o');
      $(this).addClass('icon-star');
    });
  },

  stopPropagation(evt) {
    evt.stopPropagation();
  },

  unstarTrack(track, evt) {
    let tracksCopy = this.state.tracks;

    evt.preventDefault();
    evt.stopPropagation();

    tracksCopy = _.reject(tracksCopy, starredTrack => {
      return starredTrack.sourceParam === track.sourceParam && starredTrack.sourceUrl === track.sourceUrl;
    });

    this.setState({ tracks: tracksCopy }, TrackActions.unstar.bind(null, track));
  },

  selectTrack(track, index) {
    PlaylistActions.play(this.state.tracks, TrackActions.select.bind(null, track, index));
  },

  renderStar(track) {
    if ( !_.isEmpty(this.props.currentUser) && this.props.currentUser.id === this.props.profileUser.id ) {
      return (
        <i className="track-star fa icon-star" onClick={this.unstarTrack.bind(null, track)} />
      );
    }
  },

  renderTrackDuration(track) {
    if ( track.duration ) {
      return (
        <span className="duration">{Helpers.formatSecondsAsTime(track.duration)}</span>
      );
    }
  },

  renderTrackSource(track) {
    let elementClasses = 'source ' + track.source;
    let iconClasses = 'fa icon-' + track.source;
    let element;

    if ( track.source === 'youtube' ) {
      iconClasses += '-play';
    }

    element = (
      <div className={elementClasses}>
        <i className={iconClasses}></i>
        <a href={track.sourceUrl} target="_blank" />
      </div>
    );

    return element;
  },

  renderStarredTracks() {
    let isActive;
    let classes;

    return _.map(this.state.tracks, (track, index) => {
      isActive = !_.isEmpty(this.props.currentTrack) && this.props.currentTrack.sourceParam === track.sourceParam && this.props.currentTrack.sourceUrl === track.sourceUrl;
      classes = cx({
        'mini-track': true,
        'active': isActive
      });

      return (
        <li className={classes} key={index} onClick={this.selectTrack.bind(null, track, index)}>
          <div className="star-container">
            {this.renderStar(track)}
          </div>
          <div className="info-container">
            <h6 className="title small">{track.title} {this.renderTrackDuration(track)}</h6>
          </div>
          {this.renderTrackSource(track)}
        </li>
      );
    });
  },

  render() {
    return (
      <ul className="mini-tracklist">
        {this.renderStarredTracks()}
      </ul>
    );
  }

});

export default MiniTracklist;