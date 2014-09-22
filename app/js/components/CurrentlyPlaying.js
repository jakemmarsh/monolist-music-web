/**
 * @jsx React.DOM
 */
 'use strict';

var React      = require('react/addons');

var ControlBar = require('./ControlBar');

var cx         = React.addons.classSet;

var CurrentlyPlaying = React.createClass({

  render: function() {
    var classes = cx({
      'currently-playing': true,
      'full': this.props.displayFull
    });
    var styles = {
      'background-image': this.props.displayFull ? 'url(' + this.props.currentTrack.artistImageUrl + ')' : 'none'
    };

    return (
      <div className={classes} style={styles}>

        <div className="song-info">
          <h1 className="title">{this.props.currentTrack.title}</h1>
          <h5 className="artist">{this.props.currentTrack.artist}</h5>
        </div>

        <ControlBar isPlaying={this.props.isPlaying}
                    repeat={this.props.repeat}
                    shuffle={this.props.shuffle}
                    nextTrack={this.props.nextTrack}
                    lastTrack={this.props.lastTrack}
                    togglePlay={this.props.togglePlay}
                    toggleRepeat={this.props.toggleRepeat}
                    toggleShuffle={this.props.toggleShuffle} />

      </div>
    );
  }

});

module.exports = CurrentlyPlaying;