/**
 * @jsx React.DOM
 */
 'use strict';

var React               = require('react/addons');
var $                   = require('jquery');

var AudioControlBar     = require('./AudioControlBar');
var PlayerVisualization = require('./PlayerVisualization');

var cx                  = React.addons.classSet;

var CurrentlyPlaying = React.createClass({

  propTypes: {
    currentTrack: React.PropTypes.object,
    currentAudio: React.PropTypes.object,
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

  getInitialState: function() {
    return {
      isFull: this.props.currentTrack !== null,
      userHasMinimized: false
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if ( !this.state.userHasMinimized ) {
      this.setState({ isFull: nextProps.currentTrack !== null }, this.changeMainContentWrapperClass);
    }
  },

  changeMainContentWrapperClass: function() {
    if ( this.state.isFull ) {
      $('.main-content-wrapper').removeClass('tall');
    } else {
      $('.main-content-wrapper').addClass('tall');
    }
  },

  toggleMinimizePlayer: function() {
    this.setState({
      isFull: !this.state.isFull,
      userHasMinimized: true
    }, this.changeMainContentWrapperClass);
  },

  renderTitle: function() {
    var element = null;

    if ( this.props.currentTrack && this.props.currentTrack.title ) {
      element = (
        <h1 className="title">{this.props.currentTrack.title}</h1>
      );
    }

    return element;
  },

  renderArtist: function() {
    var element = null;

    if ( this.props.currentTrack && this.props.currentTrack.artist ) {
      element = (
        <h5 className="artist">{this.props.currentTrack.artist}</h5>
      );
    }

    return element;
  },

  renderSongInfo: function() {
    var element = null;

    if ( this.props.currentTrack ) {
      element = (
        <div className="song-info">
          {this.renderTitle()}
          {this.renderArtist()}
        </div>
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

        {this.renderSongInfo()}

        <div className="player-toggle" onClick={this.toggleMinimizePlayer}>
          <hr />
          <hr />
          <hr />
        </div>

        <AudioControlBar ref="controlBar"
                         currentAudio={this.props.currentAudio}
                         currentTrack={this.props.currentTrack}
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

        <PlayerVisualization currentAudio={this.props.currentAudio} />

      </div>
    );
  }

});

module.exports = React.createFactory(CurrentlyPlaying);