'use strict';

var _        = require('underscore');
var $        = require('jquery');

var APIUtils = require('../utils/APIUtils');

var PlayerControlsMixin = {

  playedIndices: [],

  getInitialState: function() {
    return {
      index: -1,
      repeat: false,
      shuffle: false,
      volume: 0.7,
      time: 0,
      paused: false,
      audio: new Audio(),
      track: null
    };
  },

  componentDidMount: function() {
    $(document).keydown(this.handleGlobalKeyPress);
    this.addTrackListeners();
  },

  componentWillUnmount: function() {
    this.removeTrackListeners();
  },

  handleGlobalKeyPress: function(evt) {
    var keyCode = evt.keyCode || evt.which;
    var isInInput = ($('input').is(':focus')) && !($('textarea').is(':focus'));
    var isControlKey = (keyCode === 32 || keyCode === 37 || keyCode === 39);

    // Only use global actions if user isn't in an input or textarea
    if ( !isInInput && isControlKey ) {
      evt.stopPropagation();
      evt.preventDefault();

      switch( keyCode ) {
        case 32: // Space bar
          this.togglePlay();
          break;
        case 37: // Left arrow
          this.lastTrack();
          break;
        case 39: // Right arrow
          this.nextTrack();
          break;
      }
    }
  },

  addTrackListeners: function() {
    this.state.audio.volume = this.state.volume;
    this.state.audio.addEventListener('timeupdate', this.updateProgress);
    this.state.audio.addEventListener('ended', this.nextTrack);
  },

  removeTrackListeners: function() {
    this.state.audio.removeEventListener('ended', this.nextTrack);
  },

  updateProgress: function() {
    this.setState({
      time: this.state.audio.time
    });
  },

  seekTrack: function(newTime) {
    this.state.audio.currentTime = newTime;
  },

  updateVolume: function(newVolume) {
    this.setState({
      volume: newVolume
    }, function() {
      this.state.audio.volume = this.state.volume;
    });
  },

  getRandomTrackIndex: function() {
    var index = Math.floor((Math.random() * this.state.playlist.tracks.length - 1) + 1);

    // Recurse until we're not playing the same or last track
    if ( index === this.state.index || index === this.playedIndices[this.playedIndices.length - 1] ) {
      return this.getRandomTrackIndex();
    }

    return index;
  },

  stopPreviousTrack: function() {
    this.state.audio.pause();
    this.removeTrackListeners();
  },

  transitionToNewTrack: function() {
    this.state.audio.setAttribute('src', APIUtils.getStreamUrl(this.state.track));

    this.addTrackListeners();
    // TODO: don't auto-play if paused and "next" button is clicked
    this.state.audio.play();
  },

  lastTrack: function() {
    var newIndex = this.playedIndices.pop();

    this.selectTrack(this.state.playlist.tracks[newIndex], newIndex);
  },

  nextTrack: function() {
    var newIndex = null;

    if ( this.state.shuffle ) {
      // Only loop back if user has 'repeat' toggled
      if ( this.state.repeat ) {
        newIndex = this.getRandomTrackIndex();
      } else {
        newIndex = ( this.playedIndices.length < this.state.playlist.tracks.length ) ? this.getRandomTrackIndex() : null;
      }
    } else {
      newIndex = this.state.index + 1;

      // Only loop back if user has 'repeat' toggled
      if ( newIndex > this.state.playlist.tracks.length - 1 ) {
        if ( this.state.repeat ) {
          newIndex = 0;
        } else {
          newIndex = null;

          this.setState({
            track: null
          }, function() {
            this.state.audio.setAttribute('src', '');
          });
        }
      }
    }

    this.stopPreviousTrack();

    if ( newIndex !== null ) {
      this.selectTrack(this.state.playlist.tracks[newIndex], newIndex);
    }
  },

  selectTrack: function(track, index) {


    this.playedIndices.push(this.state.index);

    this.stopPreviousTrack();

    this.setState({
      track: newTrack,
      index: newIndex,
    }, this.transitionToNewTrack);
  },

  selectPlaylist: function(newPlaylist, cb) {
    cb = cb || function() {};

    if ( !newPlaylist.tracks ) {
      newPlaylist = {
        tracks: newPlaylist
      };
    }

    this.setState({
      playlist: newPlaylist,
      index: -1
    }, function() {
      this.playedIndices = [];

      cb();
    });
  },

  togglePlay: function() {
    if ( !this.state.track ) {
      this.nextTrack();
    }

    this.setState({
      paused: !this.state.paused
    }, function() {
      if ( this.state.paused ) {
        this.state.audio.play();
      } else {
        this.state.audio.pause();
      }
    });
  },

  toggleRepeat: function() {
    this.setState({
      repeat: !this.state.repeat
    });
  },

  toggleShuffle: function() {
    this.setState({
      shuffle: !this.state.shuffle
    });
  }

};

module.exports = PlayerControlsMixin;