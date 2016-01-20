'use strict';

import React           from 'react';
import $               from 'jquery';
import qs              from 'querystring';
import cx              from 'classnames';
import _               from 'lodash';

import Helpers         from '../utils/Helpers';
import GlobalActions   from '../actions/GlobalActions';
import TrackActions    from '../actions/TrackActions';
import PlaylistActions from '../actions/PlaylistActions';

var AudioControlBar = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    colors: React.PropTypes.object,
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

  getDefaultProps() {
    return {
      currentUser: [],
      userCollaborations: [],
      currentTrack: {}
    };
  },

  getInitialState() {
    return {
      isFixed: false
    };
  },

  componentDidMount() {
    let $window = $(window);

    $window.scroll(() => {
      let $largeInfoContainer = $('.artwork-info-container');
      let currentlyPlayingBottom = $largeInfoContainer.offset().top + $largeInfoContainer.height();
      let scrollTop = $window.scrollTop();

      if ( scrollTop > currentlyPlayingBottom && !this.state.isFixed ) {
        this.setState({ isFixed: true });
      } else if ( scrollTop < currentlyPlayingBottom && this.state.isFixed ) {
        this.setState({ isFixed: false });
      }
    });
  },

  componentWillUnmount() {
    $(window).off('scroll');
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

  seekTrack(evt) {
    const $seekBar = $(this.refs.seek);
    const clickLeftOffset = evt.pageX - $seekBar.offset().left;
    const newTime = clickLeftOffset / $seekBar.outerWidth() * this.getTrackDuration();

    this.props.seekTrack(newTime);
  },

  updateVolume(evt) {
    const $volumeBar = $(this.refs.volume);
    const clickLeftOffset = evt.pageX - $volumeBar.offset().left;
    const newVolume = clickLeftOffset / $volumeBar.outerWidth();

    this.props.updateVolume(newVolume);
  },

  buildTwitterUrl() {
    const url = 'https://twitter.com/intent/tweet?';
    const text = this.props.currentTrack.title + (this.props.currentTrack.artist ? ` by ${this.props.currentTrack.artist}` : '');
    const hashTags = ['CurrentlyPlaying', 'Monolist'];
    const queryString = qs.stringify({
      text: text,
      hashtags: hashTags.join(','),
      url: this.playlistUrl
    });

    return url + queryString;
  },

  doTwitterShare() {
    const url = this.buildTwitterUrl();
    const width = 550;
    const height = 300;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    window.open(
      url,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + height + ',width=' + width + ',top=' + top + ',left=' + left
    );
  },

  showContextMenu(evt) {
    const menuItems = (
      <div>
        {this.renderStarTrackOption()}
        {this.renderAddTrackOption()}
        {this.renderTweetTrackOption()}
      </div>
    );

    if ( evt ) {
      evt.stopPropagation();
      evt.preventDefault();
    }

    GlobalActions.openContextMenu(menuItems, evt.pageX, evt.pageY);
  },

  renderPossiblePlaylists() {
    return _.map(this.props.userCollaborations, (playlist, index) => {
      return (
        <li className="menu-item"
            key={index}
            onClick={PlaylistActions.addTrack.bind(null, playlist, this.props.currentTrack, () => {})}>
          {playlist.title}
        </li>
      );
    });
  },

  renderStarTrackOption() {
    const userHasStarred = !_.isEmpty(this.props.currentUser) && !!_.where(this.props.currentUser.starredTracks, {
      sourceParam: this.props.currentTrack.sourceParam,
      sourceUrl: this.props.currentTrack.sourceUrl
    }).length;
    const iconClass = 'fa ' + (userHasStarred ? 'icon-star-o' : 'icon-star');
    const text = userHasStarred ? 'Unstar Track' : 'Star Track';
    const func = userHasStarred ? TrackActions.unstar : TrackActions.star;

    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <li className="menu-item" onClick={func.bind(null, this.props.currentTrack, () => {})}>
          <i className={iconClass} />
          {text}
        </li>
      );
    }
  },

  renderAddTrackOption() {
    let element = null;

    if ( !!this.props.userCollaborations.length ) {
      element = (
        <li className="menu-item">
          <i className="icon-plus" />
          Add Track To Playlist
          <i className="icon-chevron-right float-right flush--right" />
          <ul>
            {this.renderPossiblePlaylists(this.props.userCollaborations, this.props.currentTrack)}
          </ul>
        </li>
      );
    }

    return element;
  },

  renderTweetTrackOption() {
    return (
      <li className="menu-item" onClick={this.doTwitterShare}>
        <i className="icon-twitter" />
        Tweet Track
      </li>
    );
  },

  renderSongInfo() {
    let title;
    let joiner;
    let artist;
    let classes;

    if ( !_.isEmpty(this.props.currentTrack) ) {
      title = this.props.currentTrack.title;
      joiner = this.props.currentTrack.artist ? ' by ' : '';
      artist = this.props.currentTrack.artist || '';
      classes = cx({
        'scrolling-info-container': true,
        'animate-height': true,
        'animate-height-hidden': !this.state.isFixed
      });

      return (
        <div className={classes}>
          <div className="soft-quarter--top">
            {title}{joiner}{artist}
          </div>
        </div>
      );
    }
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
    let fillValue = this.props.time / this.getTrackDuration();
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

  renderMenuToggle() {
    if ( !_.isEmpty(this.props.currentUser) && !_.isEmpty(this.props.currentTrack) ) {
      return (
        <div className="dropdown-toggle-container">
          <i className="icon-ellipsis-h" onClick={this.showContextMenu} />
        </div>
      );
    }
  },

  render() {
    let controlBarClasses = cx({
      'control-bar': true,
      'fixed': this.state.isFixed
    });
    let playPauseClasses = cx({
      'fa': true,
      'icon-pause': !this.props.paused,
      'icon-play': this.props.paused
    });
    let repeatClasses = cx({
      'fa': true,
      'icon-refresh': true,
      'active': this.props.repeat
    });
    let shuffleClasses = cx({
      'fa': true,
      'icon-random': true,
      'active': this.props.shuffle
    });

    return (
      <div className={controlBarClasses}>

        {this.renderSongInfo()}

        <div className="controls-wrapper">
          <div className="playback-container">
            <div className="backward-container">
              <i ref="backButton" className="icon-backward" onClick={this.props.previousTrack}></i>
            </div>
            <div className="play-pause-container">
              <i ref="playPauseButton" className={playPauseClasses} onClick={this.props.togglePlay}></i>
            </div>
            <div className="forward-container">
              <i ref="nextButton" className="icon-forward" onClick={this.props.nextTrack}></i>
            </div>
          </div>

          {this.renderMenuToggle()}

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
              <i className="icon-volume-up"></i>
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
        </div>

        <div className="shadow" />

      </div>
    );
  }

});

export default AudioControlBar;