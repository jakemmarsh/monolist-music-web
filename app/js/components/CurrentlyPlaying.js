/**
 * @jsx React.DOM
 */
 'use strict';

var React      = require('react/addons');

var AudioControlBar = require('./AudioControlBar');

var cx         = React.addons.classSet;

var CurrentlyPlaying = React.createClass({

  getInitialState: function() {
    return {
      isFull: this.props.displayFull
    };
  },

  toggleMinimizePlayer: function() {
    this.setState({
      isFull: !this.state.isFull
    });
  },

  render: function() {
    var classes = cx({
      'currently-playing': true,
      'full': this.state.isFull
    });
    var styles = {
      'background-image': this.state.isFull ? 'url(' + this.props.currentTrack.artistImageUrl + ')' : 'none'
    };

    return (
      <div className={classes} style={styles}>

        <div className="song-info">
          <h1 className="title">{this.props.currentTrack.title}</h1>
          <h5 className="artist">{this.props.currentTrack.artist}</h5>
        </div>

        <div className="player-toggle" onClick={this.toggleMinimizePlayer}>
          <hr />
          <hr />
          <hr />
        </div>

        <ControlBar ref="controlBar"
                    isPlaying={this.props.isPlaying}
                    volume={this.props.volume}
                    currentTime={this.props.currentTime}
                    duration={this.props.duration}
                    repeat={this.props.repeat}
                    shuffle={this.props.shuffle}
                    nextTrack={this.props.nextTrack}
                    lastTrack={this.props.lastTrack}
                    togglePlay={this.props.togglePlay}
                    updateProgress={this.props.updateProgress}
                    updateVolume={this.props.updateVolume}
                    toggleRepeat={this.props.toggleRepeat}
                    toggleShuffle={this.props.toggleShuffle} />

      </div>
    );
  }

});

module.exports = CurrentlyPlaying;