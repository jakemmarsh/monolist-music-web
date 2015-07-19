'use strict';

import React   from 'react/addons';
import $       from 'jquery';
import cx      from 'classnames';
import _       from 'lodash';

import Helpers from '../utils/Helpers';

var AudioControlBar = React.createClass({

  top: 0,

  propTypes: {
    player: React.PropTypes.object,
    audio: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    paused: React.PropTypes.bool,
    time: React.PropTypes.number,
    duration: React.PropTypes.number,
    volume: React.PropTypes.number,
    repeat: React.PropTypes.bool,
    shuffle: React.PropTypes.bool,
    previousTrack: React.PropTypes.func.isRequired,
    togglePlay: React.PropTypes.func.isRequired,
    nextTrack: React.PropTypes.func.isRequired,
    seekTrack: React.PropTypes.func.isRequired,
    updateVolume: React.PropTypes.func.isRequired,
    toggleRepeat: React.PropTypes.func.isRequired,
    toggleShuffle: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      isFixed: false
    };
  },

  componentDidMount() {
    this.top = $(this.getDOMNode()).offset().top;

    $('.currently-playing').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', () => {
      this.top = $(this.getDOMNode()).offset().top;
    });

    $(window).scroll(() => {
      if ( $(window).scrollTop() > this.top && !this.state.isFixed ) {
        this.setState({ isFixed: true });
      } else if ( $(window).scrollTop() < this.top - 10 && this.state.isFixed ) {
        this.setState({ isFixed: false });
      }
    });
  },

  getTrackDuration() {
    var duration = 0;

    if ( this.props.currentTrack && this.props.currentTrack.duration ) {
      duration = this.props.currentTrack.duration;
    } else if ( this.props.player && isFinite(this.props.player.duration) ) {
      duration = this.props.player.duration;
    } else if ( isFinite(this.props.duration) ) {
      duration = this.props.duration;
    }

    return duration;
  },

  renderTimePassed() {
    let formattedTimePassed = Helpers.formatSecondsAsTime(this.props.time);

    return (
      <span className="time-passed">{formattedTimePassed}</span>
    );
  },

  renderTimeLeft() {
    let timeLeft = this.getTrackDuration() - this.props.time;
    let formattedTimeLeft = Helpers.formatSecondsAsTime(timeLeft);

    return (
      <span className="time-left">{formattedTimeLeft}</span>
    );
  },

  renderProgressFill() {
    let fillValue = this.props.time/this.getTrackDuration();
    let progressStyles = {
      'width': fillValue * 100 + '%'
    };

    return (
      <div className="progress-fill" style={progressStyles} />
    );
  },

  renderVolumeFill() {
    let volumeStyles = {
      'width': this.props.volume * 100 + '%'
    };

    return (
      <div className="volume-fill" style={volumeStyles} />
    );
  },

  seekTrack(evt) {
    let $seekBar = $(this.refs.seek.getDOMNode());
    let clickLeftOffset = evt.pageX - $seekBar.offset().left;
    let newTime = clickLeftOffset/$seekBar.outerWidth() * this.getTrackDuration();

    this.props.seekTrack(newTime);
  },

  updateVolume(evt) {
    let $volumeBar = $(this.refs.volume.getDOMNode());
    let clickLeftOffset = evt.pageX - $volumeBar.offset().left;
    let newVolume = clickLeftOffset/$volumeBar.outerWidth();

    this.props.updateVolume(newVolume);
  },

  render() {
    let controlBarClasses = cx({
      'control-bar': true,
      'fixed': this.state.isFixed
    });
    let playPauseClasses = cx({
      'fa': true,
      'fa-pause': !this.props.paused,
      'fa-play': this.props.paused
    });
    let repeatClasses = cx({
      'fa': true,
      'fa-refresh': true,
      'active': this.props.repeat
    });
    let shuffleClasses = cx({
      'fa': true,
      'fa-random': true,
      'active': this.props.shuffle
    });

    return (
      <div className={controlBarClasses}>

        <div className="playback-container">
          <div className="backward-container">
            <i className="fa fa-backward" onClick={this.props.previousTrack}></i>
          </div>
          <div className="play-pause-container">
            <i className={playPauseClasses} onClick={this.props.togglePlay}></i>
          </div>
          <div className="forward-container">
            <i className="fa fa-forward" onClick={this.props.nextTrack}></i>
          </div>
        </div>

        <div className="scrubber-container">
          {this.renderTimePassed()}
          <div ref="seek"
               name="seek"
               className="seek-scrubber"
               onClick={this.seekTrack}>
            {this.renderProgressFill()}
          </div>
          {this.renderTimeLeft()}
        </div>

        <div className="globals-container soft-quarter--right">
          <div className="volume-container">
            <i className="fa fa-volume-up"></i>
            <div ref="volume"
                   name="volume"
                   className="volume-scrubber"
                   onClick={this.updateVolume}>
              {this.renderVolumeFill()}
            </div>
          </div>
          <div className="repeat-container">
            <i ref="toggleRepeat" className={repeatClasses} onClick={this.props.toggleRepeat}></i>
          </div>
          <div className="shuffle-container">
            <i ref="toggleShuffle" className={shuffleClasses} onClick={this.props.toggleShuffle}></i>
          </div>
        </div>

        <div className="shadow" />

      </div>
    );
  }

});

export default AudioControlBar;