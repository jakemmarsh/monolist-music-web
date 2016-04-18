'use strict';

import React            from 'react';
import cx               from 'classnames';
import _                from 'lodash';
import {Link}           from 'react-router';

import Helpers          from '../utils/Helpers';
import PlaybackActions  from '../actions/PlaybackActions';
import CurrentlyPlaying from './CurrentlyPlaying';
import Spinner          from './Spinner';
import Tracklist        from './Tracklist';

const PlayerSidebar = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    player: React.PropTypes.object,
    audio: React.PropTypes.object,
    currentPlaylist: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    paused: React.PropTypes.bool,
    buffering: React.PropTypes.bool,
    time: React.PropTypes.number,
    duration: React.PropTypes.number,
    volume: React.PropTypes.number,
    repeat: React.PropTypes.string,
    shuffle: React.PropTypes.bool
  },

  getInitialState() {
    return {
      isMuted: false,
      showVolumeBar: false,
      unmutedVolume: this.props.volume
    };
  },

  getTrackDuration() {
    let duration = 0;

    if ( this.props.currentTrack && this.props.currentTrack.duration ) {
      duration = this.props.currentTrack.duration;
    } else if ( this.props.player && isFinite(this.props.player.duration) ) {
      duration = this.props.player.duration;
    } else if ( isFinite(this.props.duration) ) {
      duration = this.props.duration;
    }

    return duration;
  },

  showVolumeBar() {
    this.setState({
      showVolumeBar: true
    });
  },

  hideVolumeBar() {
    this.setState({
      showVolumeBar: false
    });
  },

  handleSeek(evt) {
    const seekBar = this.refs.seekBar;
    const clickLeftOffset = evt.pageX - seekBar.offsetLeft;
    const newTime = clickLeftOffset / seekBar.offsetWidth * this.getTrackDuration();

    PlaybackActions.seek(newTime);
  },

  handleMute() {
    const shouldMute = !this.state.isMuted;

    this.setState({
      isMuted: !this.state.isMuted
    }, () => {
      if ( shouldMute ) {
        PlaybackActions.updateVolume(0);
      } else {
        PlaybackActions.updateVolume(this.state.unmutedVolume);
      }
    });
  },

  handleVolumeChange(evt) {
    const volumeBar = this.refs.volumeBar;
    const clickLeftOffset = evt.pageX - volumeBar.offsetLeft;
    const newVolume = clickLeftOffset / volumeBar.offsetWidth;

    this.setState({
      unmutedVolume: newVolume
    }, PlaybackActions.updateVolume.bind(null, newVolume));
  },

  renderTimePassed() {
    const formattedTimePassed = Helpers.formatSecondsAsTime(this.props.time);

    return (
      <div ref="timePassed" className="player-sidebar-seek-bar-timestamp-container text-left">
        {formattedTimePassed}
      </div>
    );
  },

  renderTimeLeft() {
    const timeLeft = this.getTrackDuration() - this.props.time;
    const formattedTimeLeft = Helpers.formatSecondsAsTime(timeLeft);

    return (
      <div ref="timeLeft" className="player-sidebar-seek-bar-timestamp-container text-right">
        {formattedTimeLeft}
      </div>
    );
  },

  renderProgressFill() {
    const fillValue = this.props.time / this.getTrackDuration();
    const progressStyles = {
      'width': fillValue * 100 + '%'
    };

    return (
      <div className="player-sidebar-control-bar-fill" style={progressStyles} />
    );
  },

  renderSeekBar() {
    return (
      <div className="player-sidebar-seek-bar-container">
        {this.renderTimePassed()}
        <div ref="seekBar"
             className="player-sidebar-seek-bar player-sidebar-control-bar"
             onClick={this.handleSeek}>
          {this.renderProgressFill()}
        </div>
        {this.renderTimeLeft()}
      </div>
    );
  },

  renderRepeatTrackIndicator() {
    if ( this.props.repeat === 'track' ) {
      return (
        <span className="player-sidebar-repeat-track-indicator">
          1
        </span>
      );
    }
  },

  renderRepeatIcon() {
    const repeatClasses = cx('icon-refresh', 'player-sidebar-secondary-playback-control', {
      'icon-refresh': true,
      'active': this.props.repeat !== 'none'
    });

    return (
      <div className="player-sidebar-repeat-container nudge-quarter--right">
        <i ref="repeatButton" className={repeatClasses} onClick={PlaybackActions.toggleRepeat} />
        {this.renderRepeatTrackIndicator()}
      </div>
    );
  },

  renderShuffleIcon() {
    const shuffleClasses = cx('icon-random', 'player-sidebar-secondary-playback-control', {
      'active': this.props.shuffle
    });

    return (
      <i ref="toggleShuffle" className={shuffleClasses} onClick={PlaybackActions.toggleShuffle} />
    );
  },

  renderPlayIcon() {
    const playPauseClasses = cx('player-sidebar-playback-control', 'nudge--sides', {
      'icon-pause': !this.props.paused,
      'icon-play': this.props.paused
    });
    let element;

    if ( this.props.buffering ) {
      element = (
        <Spinner size={10} className="player-sidebar-spinner nudge--sides" />
      );
    } else {
      element = (
        <i ref="playPauseButton"
           className={playPauseClasses}
           onClick={PlaybackActions.togglePlay} />
      );
    }

    return element;
  },

  renderVolumeFill() {
    const volumeStyles = {
      'width': this.props.volume * 100 + '%'
    };

    return (
      <div className="player-sidebar-control-bar-fill player-sidebar-volume-fill"
           style={volumeStyles} />
    );
  },

  renderVolumeBar() {
    if ( this.state.showVolumeBar ) {
      return (
        <div className="player-sidebar-volume-bar-container">
          <div ref="volumeBar"
               className="player-sidebar-volume-bar player-sidebar-control-bar"
               onClick={this.handleVolumeChange}>
            {this.renderVolumeFill()}
          </div>
        </div>
      );
    }
  },

  renderVolumeIcon() {
    const volumeClasses = cx('player-sidebar-secondary-playback-control', {
      'icon-volume-up': this.props.volume > 0,
      'icon-volume-off': this.props.volume <= 0
    });

    return (
      <div className="player-sidebar-volume-control-container"
           onMouseEnter={this.showVolumeBar}
           onMouseLeave={this.hideVolumeBar}>
        <i ref="volumeIcon"
           className={volumeClasses}
           onClick={this.handleMute} />
        {this.renderVolumeBar()}
      </div>
    );
  },

  renderControls() {
    return (
      <div className="player-sidebar-controls-container">
        <div className="fx-1 text-left">
          {this.renderRepeatIcon()}
          {this.renderShuffleIcon()}
        </div>
        <div className="fx-3 text-center">
          <i ref="backButton"
             className="player-sidebar-playback-control icon-backward"
             onClick={PlaybackActions.previousTrack} />
          {this.renderPlayIcon()}
          <i ref="nextButton"
             className="player-sidebar-playback-control icon-forward"
             onClick={PlaybackActions.nextTrack} />
        </div>
        <div className="fx-1 text-right">
          {this.renderVolumeIcon()}
        </div>
      </div>
    );
  },

  renderCurrentPlaylistInfo() {
    if ( !_.isEmpty(this.props.currentPlaylist) && this.props.currentPlaylist.title ) {
      const numLikes = this.props.currentPlaylist.likes ? this.props.currentPlaylist.likes.length : 0;
      const numPlays = this.props.currentPlaylist.plays ? this.props.currentPlaylist.plays.length : 0;
      return (
        <div className="player-sidebar-playlist-info-container d-f">
          <div className="fx-2">
            <Link to={`/playlist/${this.props.currentPlaylist.slug}`}
                  className="player-sidebar-playlist-title gamma highlight light">
              {this.props.currentPlaylist.title}
            </Link>
          </div>
          <div className="fx-1 text-right muted">
            <span className="nudge-quarter--right">
              <i className="icon-play player-sidebar-stat-icon" /> {numPlays}
            </span>
            <span>
              <i className="icon-heart player-sidebar-stat-icon" /> {numLikes}
            </span>
          </div>
        </div>
      );
    }
  },

  renderCurrentPlaylist() {
    if ( !_.isEmpty(this.props.currentPlaylist) ) {
      return (
        <div className="player-sidebar-playlist-container d-f fxd-c fx-1">
          <h6 className="flush muted">
            current playlist
          </h6>
          {this.renderCurrentPlaylistInfo()}
          <div className="player-sidebar-playlist fx-1">
            <Tracklist type="playlist"
                       mini={true}
                       playlist={this.props.currentPlaylist}
                       currentTrack={this.props.currentTrack}
                       currentUser={this.props.currentUser}
                       userCollaborations={this.props.userCollaborations} />
          </div>
        </div>
      );
    }
  },

  render() {
    const sidebarClasses = cx('player-sidebar', 'fx-400', 'ord-2', 'h-1-1', {
      expanded: !_.isEmpty(this.props.currentTrack)
    });

    return (
      <div className={sidebarClasses}>
        <div className="player-sidebar-wrapper d-f fxd-c h-1-1">
          <CurrentlyPlaying ref="currentlyPlaying"
                            currentUser={this.props.currentUser}
                            userCollaborations={this.props.userCollaborations}
                            player={this.props.player}
                            audio={this.props.audio}
                            currentTrack={this.props.currentTrack}
                            buffering={this.props.buffering}
                            paused={this.props.paused}
                            time={this.props.time}
                            duration={this.props.duration}
                            volume={this.props.volume}
                            repeat={this.props.repeat}
                            shuffle={this.props.shuffle} />
          {this.renderSeekBar()}
          {this.renderControls()}
          {this.renderCurrentPlaylist()}
        </div>
      </div>
    );
  }

});

export default PlayerSidebar;
