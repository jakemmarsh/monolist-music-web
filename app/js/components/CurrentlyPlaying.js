'use strict';

import React           from 'react';
import $               from 'jquery';
import cx              from 'classnames';
import _               from 'lodash';

import AudioControlBar from './AudioControlBar';

var CurrentlyPlaying = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    player: React.PropTypes.object,
    audio: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
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
    if ( this.hasTrack() && this.props.currentTrack.source === 'youtube' ) {
      $('#artwork').fadeOut('fast', () => {
        $('#yt-player').fadeIn().css('display', 'inline-block');
      });
    } else if ( this.hasTrack() ) {
      $('#yt-player').fadeOut('fast', () => {
        $('#artwork').fadeIn().css('display', 'inline-block');
      });
    }
  },

  componentDidUpdate() {
    this._displayArtOrVideo();
  },

  hasTrack() {
    return !_.isEmpty(this.props.currentTrack);
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
      'full': this.hasTrack(),
      'fx-n': true
    });
    const artworkStyles = {
      'backgroundImage': hasImage ? 'url(' + this.props.currentTrack.imageUrl + ')' : null
    };

    return (
      <div className={classes}>

        <div className="artwork-info-container">
          <div className="image-video-container soft-quarter--ends">
            <div id="yt-player" />
            <div id="artwork" style={artworkStyles} />
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
