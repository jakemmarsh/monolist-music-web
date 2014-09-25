/**
 * @jsx React.DOM
 */
 'use strict';

var React               = require('react/addons');

var AudioControlBar     = require('./AudioControlBar');
var PlayerVisualization = require('./PlayerVisualization');

var cx                  = React.addons.classSet;

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

  renderTitle: function() {
    var element = null;

    if ( this.props.currentTrack.title ) {
      element = (
        <h1 className="title">{this.props.currentTrack.title}</h1>
      );
    }

    return element;
  },

  renderArtist: function() {
    var element = null;

    if ( this.props.currentTrack.artist ) {
      element = (
        <h5 className="artist">{this.props.currentTrack.artist}</h5>
      );
    }

    return element;
  },

  render: function() {
    var classes = cx({
      'currently-playing': true,
      'full': this.state.isFull
    });

    return (
      <div className={classes}>

        <div className="song-info">
          {this.renderTitle()}
          {this.renderArtist()}
        </div>

        <div className="player-toggle" onClick={this.toggleMinimizePlayer}>
          <hr />
          <hr />
          <hr />
        </div>

        <AudioControlBar ref="controlBar"
                    currentAudio={this.props.currentAudio}
                    duration={this.props.duration}
                    volume={this.props.volume}
                    repeat={this.props.repeat}
                    shuffle={this.props.shuffle}
                    nextTrack={this.props.nextTrack}
                    lastTrack={this.props.lastTrack}
                    togglePlay={this.props.togglePlay}
                    updateProgress={this.props.updateProgress}
                    updateVolume={this.props.updateVolume}
                    toggleRepeat={this.props.toggleRepeat}
                    toggleShuffle={this.props.toggleShuffle} />

        <PlayerVisualization currentAudio={this.props.currentAudio} />

      </div>
    );
  }

});

module.exports = CurrentlyPlaying;