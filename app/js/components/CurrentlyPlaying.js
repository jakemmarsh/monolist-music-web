'use strict';

import React           from 'react';
import cx              from 'classnames';
import _               from 'lodash';

import Animations      from '../utils/Animations';
import AudioControlBar from './AudioControlBar';

var CurrentlyPlaying = React.createClass({

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

  componentWillReceiveProps(nextProps) {
    if ( !_.isEmpty(nextProps.currentTrack) && !_.isEqual(nextProps.currentTrack, this.props.currentTrack) ) {
      this._displayArtOrVideo(nextProps.currentTrack);
    }
  },

  renderTitle() {
    if ( this.props.currentTrack && this.props.currentTrack.title ) {
      return (
        <h1 className="title">{this.props.currentTrack.title}</h1>
      );
    }
  },

  renderArtist() {
    if ( this.props.currentTrack && this.props.currentTrack.artist ) {
      return (
        <h5 className="artist">{this.props.currentTrack.artist}</h5>
      );
    }
  },

  render() {
    const track = this.props.currentTrack;
    // TODO: immediately removing artwork for youtube videos is eliminating the fade out effect
    const hasImage = track && track.source !== 'youtube' && track.imageUrl;
    const wrapperClasses = cx({
      'currently-playing': true,
      'has-background': hasImage,
      'full': !_.isEmpty(track),
      'fx-n': true
    });
    const artworkStyles = {
      'backgroundImage': hasImage ? 'url(' + track.imageUrl + ')' : null
    };

    return (
      <div className={wrapperClasses}>

        <div className="artwork-info-container">
          <div className="image-video-container soft-quarter--ends">
            <div ref="ytPlayerContainer">
              <div id="yt-player" ref="ytPlayer" />
            </div>
            <div id="artwork" ref="artwork" style={artworkStyles} />
          </div>

          <div className="song-info soft-half--left">
            {this.renderTitle()}
            {this.renderArtist()}
          </div>
        </div>

        <AudioControlBar ref="controlBar"
                         currentUser={this.props.currentUser}
                         userCollaborations={this.props.userCollaborations}
                         player={this.props.player}
                         audio={this.props.audio}
                         currentTrack={this.props.currentTrack}
                         paused={this.props.paused}
                         buffering={this.props.buffering}
                         time={this.props.time}
                         duration={this.props.duration}
                         volume={this.props.volume}
                         repeat={this.props.repeat}
                         shuffle={this.props.shuffle} />

        <div className="player-background-image" style={artworkStyles} />

      </div>
    );
  }

});

export default CurrentlyPlaying;
