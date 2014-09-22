/**
 * @jsx React.DOM
 */
 'use strict';

var React = require('react/addons');

var cx    = React.addons.classSet;

var ControlBar = React.createClass({

  render: function() {
    var playPauseClasses = cx({
      'fa': true,
      'fa-pause': this.props.isPlaying,
      'fa-play': !this.props.isPlaying
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
          Scrubber bar
        </div>

        <div className="globals-container">
          <div className="volume-container">
            Volume
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

module.exports = ControlBar;