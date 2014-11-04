/**
 * @jsx React.DOM
 */
 'use strict';

var React         = require('react/addons');
var bowser        = require('bowser').browser;
var $             = require('jquery');

var Helpers       = require('../utils/Helpers');

var cx            = React.addons.classSet;

var AudioControlBar = React.createClass({

  propTypes: {
    currentAudio: React.PropTypes.object,
    repeat: React.PropTypes.bool,
    shuffle: React.PropTypes.bool,
    lastTrack: React.PropTypes.func.isRequired,
    togglePlay: React.PropTypes.func.isRequired,
    nextTrack: React.PropTypes.func.isRequired,
    seekTrack: React.PropTypes.func.isRequired,
    updateVolume: React.PropTypes.func.isRequired,
    toggleRepeat: React.PropTypes.func.isRequired,
    toggleShuffle: React.PropTypes.func.isRequired
  },

  componentWillMount: function() {
    this.browser = null;

    if ( bowser.webkit ) {
      this.browser = 'webkit';
    } else if ( bowser.msie ) {
      this.browser = 'ie';
    } else if ( bowser.firefox ) {
      this.browser = 'firefox';
    }
  },

  getTrackDuration: function() {
    var duration = 1;

    if ( isFinite(this.props.currentAudio.duration) ) {
      duration = this.props.currentAudio.duration;
    } else if ( this.props.currentTrack && this.props.currentTrack.duration ) {
      duration = this.props.currentTrack.duration;
    }

    return duration;
  },

  renderTimeLeft: function() {
    var timeLeft = this.getTrackDuration() - this.props.currentAudio.currentTime;
    var formattedTimeLeft = Helpers.formatSecondsAsTime(timeLeft);

    return (
      <span className="time-left">{formattedTimeLeft}</span>
    );
  },

  renderTimePassed: function() {
    var timePassed = this.props.currentAudio.currentTime;
    var formattedTimePassed = Helpers.formatSecondsAsTime(timePassed);

    return (
      <span className="time-passed">{formattedTimePassed}</span>
    );
  },

  getBrowserGradient: function(fillValue) {
    var gradientString;

    switch ( this.browser ) {
      case 'webkit':
        gradientString = '-webkit-gradient(linear, left top, right top, color-stop(' + fillValue + ',rgba(255,0,0,1)), color-stop(' + fillValue + ',rgba(255,255,255,0)))';
        break;
      case 'firefox':
        gradientString = '-moz-linear-gradient(top,  rgba(255,255,255,0.7) ' + fillValue + ',rgba(255,255,255,0) ' + fillValue + ')';
        break;
      case 'ie':
        gradientString = '-ms-linear-gradient(top,  rgba(255,255,255,0.7) ' + fillValue + ',rgba(255,255,255,0) ' + fillValue + ')';
        break;
      default:
        gradientString = 'linear-gradient(to top, rgba(255,255,255,0.7) ' + fillValue + ',rgba(255,255,255,0)' + fillValue + ')';
    }


    return gradientString;
  },

  renderProgressFill: function() {
    var fillValue = this.props.currentAudio.currentTime/this.getTrackDuration();
    var progressStyles = {
      'width': fillValue * 100 + '%'
    };

    return (
      <div className="progress-fill" style={progressStyles} />
    );
  },

  renderVolumeFill: function() {
    var fillValue = this.props.currentAudio.volume/1;
    var volumeStyles = {
      'width': fillValue * 100 + '%'
    };

    return (
      <div className="volume-fill" style={volumeStyles} />
    );
  },

  seekTrack: function(evt) {
    var $seekBar = $(this.refs.seek.getDOMNode());
    var clickLeftOffset = evt.pageX - $seekBar.offset().left;
    var newTime = clickLeftOffset/$seekBar.outerWidth() * this.getTrackDuration();

    this.props.seekTrack(newTime);
  },

  updateVolume: function(evt) {
    var $volumeBar = $(this.refs.volume.getDOMNode());
    var clickLeftOffset = evt.pageX - $volumeBar.offset().left;
    var newVolume = clickLeftOffset/$volumeBar.outerWidth();

    this.props.updateVolume(newVolume);
  },

  render: function() {
    var playPauseClasses = cx({
      'fa': true,
      'fa-pause': !this.props.currentAudio.paused,
      'fa-play': this.props.currentAudio.paused
    });
    var repeatClasses = cx({
      'fa': true,
      'fa-refresh': true,
      'active': this.props.repeat
    });
    var shuffleClasses = cx({
      'fa': true,
      'fa-random': true,
      'active': this.props.shuffle
    });

    return (
      <div className="control-bar">

        <div className="playback-container">
          <div className="backward-container">
            <i className="fa fa-backward" onClick={this.props.lastTrack}></i>
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

        <div className="globals-container">
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
            <i className={repeatClasses} onClick={this.props.toggleRepeat}></i>
          </div>
          <div className="shuffle-container">
            <i className={shuffleClasses} onClick={this.props.toggleShuffle}></i>
          </div>
        </div>

      </div>
    );
  }

});

module.exports = React.createFactory(AudioControlBar);