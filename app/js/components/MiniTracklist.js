'use strict';

import React           from 'react';
import cx              from 'classnames';
import _               from 'lodash';

import Helpers         from '../utils/Helpers';
import TrackActions    from '../actions/TrackActions';
import PlaylistActions from '../actions/PlaylistActions';

const MiniTracklist = React.createClass({

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
    this.refs.star.addEventListener('mouseenter', () => {
      this.refs.star.classList.remove('icon-star');
      this.refs.star.classList.add('icon-star-o');
    });

    this.refs.star.addEventListener('mouseleave', () => {
      this.refs.star.classList.remove('icon-o');
      this.refs.star.classList.add('icon-star');
    });
  },

  stopPropagation(evt) {
    evt.stopPropagation();
  },

  unstarTrack(track, evt) {
    const tracksCopy = _.reject(this.state.tracks, (starredTrack) => {
      return starredTrack.sourceParam === track.sourceParam && starredTrack.sourceUrl === track.sourceUrl;
    });

    evt.preventDefault();
    evt.stopPropagation();

    this.setState({ tracks: tracksCopy }, TrackActions.unstar.bind(null, track));
  },

  selectTrack(track, index) {
    PlaylistActions.play(this.state.tracks, TrackActions.select.bind(null, track, index));
  },

  renderStar(track) {
    if ( !_.isEmpty(this.props.currentUser) && this.props.currentUser.id === this.props.profileUser.id ) {
      return (
        <i ref="star" className="track-star fa icon-star" onClick={this.unstarTrack.bind(null, track)} />
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
    const elementClasses = 'source ' + track.source;
    const iconClasses = 'fa icon-' + track.source;

    if ( track.source === 'youtube' ) {
      iconClasses += '-play';
    }

    return (
      <div className={elementClasses}>
        <i className={iconClasses}></i>
        <a href={track.sourceUrl} target="_blank" />
      </div>
    );
  },

  renderStarredTracks() {
    return _.map(this.state.tracks, (track, index) => {
      const isActive = !_.isEmpty(this.props.currentTrack) && this.props.currentTrack.sourceParam === track.sourceParam && this.props.currentTrack.sourceUrl === track.sourceUrl;
      const classes = cx({
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
