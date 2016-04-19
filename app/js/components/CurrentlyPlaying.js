'use strict';

import React      from 'react';
import _          from 'lodash';

import Animations from '../utils/Animations';

const CurrentlyPlaying = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    player: React.PropTypes.object,
    audio: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    buffering: React.PropTypes.bool,
    paused: React.PropTypes.bool,
    time: React.PropTypes.number,
    duration: React.PropTypes.number,
    volume: React.PropTypes.number,
    repeat: React.PropTypes.string,
    shuffle: React.PropTypes.bool
  },

  _displayArtOrVideo(upcomingTrack) {
    const animationDuration = 300;
    const ytPlayerContainer = this.refs.ytPlayerContainer;
    const artwork = this.refs.artwork;

    if ( upcomingTrack.source === 'youtube' ) {
      Animations.fadeOut(artwork, animationDuration).then(() => {
        Animations.fadeIn(ytPlayerContainer, animationDuration);
      });
    } else {
      Animations.fadeOut(ytPlayerContainer, animationDuration).then(() => {
        Animations.fadeIn(artwork, animationDuration);
      });
    }
  },

  componentDidMount() {
    if ( !_.isEmpty(this.props.currentTrack) ) {
      this._displayArtOrVideo(this.props.currentTrack);
    }
  },

  componentWillReceiveProps(nextProps) {
    if ( !_.isEmpty(nextProps.currentTrack) && !_.isEqual(nextProps.currentTrack, this.props.currentTrack) ) {
      this._displayArtOrVideo(nextProps.currentTrack);
    }
  },

  renderArtist() {
    if ( this.props.currentTrack && this.props.currentTrack.artist ) {
      return (
        <h5 ref="trackArtist" className="currently-playing-song-artist flush--ends">
          {this.props.currentTrack.artist}
        </h5>
      );
    }
  },

  renderTitle() {
    if ( this.props.currentTrack && this.props.currentTrack.title ) {
      return (
        <h4 ref="trackTitle" className="currently-playing-song-title flush--ends">
          {this.props.currentTrack.title}
        </h4>
      );
    }
  },

  render() {
    const track = this.props.currentTrack;
    const hasImage = track && track.source !== 'youtube' && track.imageUrl;
    const artworkStyles = {
      backgroundImage: hasImage ? `url(${track.imageUrl})` : null
    };

    return (
      <div className="currently-playing">

        <div className="currently-playing-artwork-container">
          <div ref="ytPlayerContainer">
            <div ref="ytPlayer" id="yt-player" className="currently-playing-video" />
          </div>
          <div ref="artwork" className="currently-playing-artwork" style={artworkStyles} />
        </div>

        <div className="currently-playing-song-info-container">
          {this.renderArtist()}
          {this.renderTitle()}
        </div>

      </div>
    );
  }

});

export default CurrentlyPlaying;
