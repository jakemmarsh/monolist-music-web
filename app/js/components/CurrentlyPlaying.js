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
    shuffle: React.PropTypes.bool,
    previousTrack: React.PropTypes.func,
    togglePlay: React.PropTypes.func,
    nextTrack: React.PropTypes.func,
    seekTrack: React.PropTypes.func,
    updateVolume: React.PropTypes.func,
    toggleRepeat: React.PropTypes.func,
    toggleShuffle: React.PropTypes.func
  },

  _displayArtOrVideo() {
    if ( this.props.currentTrack.source === 'youtube' ) {
      Animations.fadeOut(this.refs.artwork).then(() => {
        Animations.fadeIn(this.refs.ytPlayer);
      });
    } else {
      Animations.fadeOut(this.refs.ytPlayer).then(() => {
        Animations.fadeIn(this.refs.artwork);
      });
    }
  },

  componentDidUpdate(prevProps) {
    if ( !_.isEmpty(this.props.currentTrack) && !_.isEqual(this.props.currentTrack, prevProps.currentTrack) ) {
      this._displayArtOrVideo();
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
    const hasImage = this.props.currentTrack && this.props.currentTrack.imageUrl;
    const classes = cx({
      'currently-playing': true,
      'has-background': hasImage,
      'full': !_.isEmpty(this.props.currentTrack),
      'fx-n': true
    });
    const artworkStyles = {
      'backgroundImage': hasImage ? 'url(' + this.props.currentTrack.imageUrl + ')' : null
    };

    return (
      <div className={classes}>

        <div className="artwork-info-container">
          <div className="image-video-container soft-quarter--ends">
            <div id="yt-player" ref="ytPlayer" />
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
                         shuffle={this.props.shuffle}
                         nextTrack={this.props.nextTrack}
                         previousTrack={this.props.previousTrack}
                         togglePlay={this.props.togglePlay}
                         seekTrack={this.props.seekTrack}
                         updateVolume={this.props.updateVolume}
                         toggleRepeat={this.props.toggleRepeat}
                         toggleShuffle={this.props.toggleShuffle} />

        <div className="player-background-image" style={artworkStyles} />

      </div>
    );
  }

});

export default CurrentlyPlaying;
