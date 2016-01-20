'use strict';

import React               from 'react';
import $                   from 'jquery';
import cx                  from 'classnames';
import _                   from 'lodash';

import AudioControlBar     from './AudioControlBar';
import ImageAnalyzer       from '../utils/ImageAnalyzer';

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
    repeat: React.PropTypes.bool,
    shuffle: React.PropTypes.bool,
    previousTrack: React.PropTypes.func,
    togglePlay: React.PropTypes.func,
    nextTrack: React.PropTypes.func,
    seekTrack: React.PropTypes.func,
    updateVolume: React.PropTypes.func,
    toggleRepeat: React.PropTypes.func,
    toggleShuffle: React.PropTypes.func
  },

  getInitialState() {
    return {
      isFull: this.props.currentTrack !== null,
      colors: null
    };
  },

  _determineColors(nextProps) {
    const hasTrack = !_.isEmpty(nextProps.currentTrack);
    const isNewTrack = _.isEmpty(this.props.currentTrack) || !_.isEqual(this.props.currentTrack, nextProps.currentTrack);
    const trackHasArt = hasTrack ? !_.isEmpty(nextProps.currentTrack.imageUrl) : false;

    if ( hasTrack && isNewTrack && trackHasArt ) {
      this.calculateTrackColors(nextProps.currentTrack);
    } else if ( !hasTrack || !trackHasArt && this.state.colors !== null ) {
      this.setState({ colors: null });
    }
  },

  _displayArtOrVideo() {
    const hasTrack = !_.isEmpty(this.props.currentTrack);

    if ( hasTrack && this.props.currentTrack.source === 'youtube' ) {
      $('#artwork').fadeOut('fast', () => {
        $('#yt-player').fadeIn().css('display', 'inline-block');
      });
    } else if ( hasTrack ) {
      $('#yt-player').fadeOut('fast', () => {
        $('#artwork').fadeIn().css('display', 'inline-block');
      });
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({ isFull: nextProps.currentTrack !== null }, this.changeMainContentWrapperClass);
    this._determineColors(nextProps);
  },

  componentDidUpdate() {
    this._displayArtOrVideo();
  },

  calculateTrackColors(nextTrack) {
    let image = new Image();
    let tempColors;

    image.addEventListener('load', () => {
      tempColors = ImageAnalyzer.extractImageColors(image, 'css');
      this.setState({
        colors: {
          background: tempColors.background,
          primaryText: tempColors.content[0],
          secondaryText: tempColors.content[1] || null
        }
      });
    });

    image.addEventListener('error', () => {
      // Image didn't load, reset colors
      this.setState({ colors: null });
    });

    image.crossOrigin = 'Anonymous';
    // TODO: better solution than this pass-through?
    image.src = 'http://cors-anywhere.herokuapp.com/' + nextTrack.imageUrl;
  },

  changeMainContentWrapperClass() {
    if ( this.state.isFull ) {
      $('.main-content-wrapper').removeClass('tall');
    } else {
      $('.main-content-wrapper').addClass('tall');
    }
  },

  renderTitle() {
    let element = null;
    let styles = {};

    if ( this.state.colors && this.state.colors.primaryText ) {
      styles.color = this.state.colors.primaryText;
    }

    if ( this.props.currentTrack && this.props.currentTrack.title ) {
      element = (
        <h1 className="title" style={styles}>{this.props.currentTrack.title}</h1>
      );
    }

    return element;
  },

  renderArtist() {
    let element = null;
    let styles = {};

    if ( this.state.colors && this.state.colors.secondaryText ) {
      styles.color = this.state.colors.secondaryText;
    }

    if ( this.props.currentTrack && this.props.currentTrack.artist ) {
      element = (
        <h5 className="artist" style={styles}>{this.props.currentTrack.artist}</h5>
      );
    }

    return element;
  },

  render() {
    const classes = cx({
      'currently-playing': true,
      'full': this.state.isFull
    });
    const artworkStyles = {
      'backgroundImage': this.props.currentTrack && this.props.currentTrack.source !== 'youtube' ? 'url(' + this.props.currentTrack.imageUrl + ')' : null
    };
    let styles = {};

    if ( this.state.colors && this.state.colors.background ) {
      styles.backgroundColor = this.state.colors.background;
    }

    return (
      <div className={classes} style={styles}>

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
                         colors={this.state.colors}
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

      </div>
    );
  }

});

export default CurrentlyPlaying;

// <div className="player-toggle" onClick={this.toggleMinimizePlayer}>
//   <hr />
//   <hr />
//   <hr />
// </div>