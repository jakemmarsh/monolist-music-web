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
    this.addTrackListeners();
    // TODO: don't auto-play if paused and "next" button is clicked
    this.state.audio.play();
  },

  lastTrack: function() {
    var newIndex;

    if ( this.state.shuffle ) {
      newIndex = this.playedIndices.pop();
    } else {
      newIndex = ( this.state.index - 1 > -1 ) ? this.state.index - 1 : 0;
    }

    this.stopPreviousTrack();

    this.setState({
      index: newIndex,
      track: this.state.playlist.tracks[newIndex],
      audio: new Audio(APIUtils.getStreamUrl(this.state.playlist.tracks[newIndex]))
    }, this.transitionToNewTrack);
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
        }
      }
    }

    this.stopPreviousTrack();

    if ( newIndex !== null ) {
      this.playedIndices.push(this.state.index);
      this.setState({
        index: newIndex,
        track: this.state.playlist.tracks[newIndex],
        audio: new Audio(APIUtils.getStreamUrl(this.state.playlist.tracks[newIndex]))
      }, this.transitionToNewTrack);
    }
  },

  selectTrack: function(track, referrer) {
    var newTrack;
    var newIndex;


    // Play song directly if from search page,
    // ignoring playlist logic
    if ( referrer === 'search' ) {
      newTrack = track;
      newIndex = 0;
    } else if ( referrer === 'playlist' ) {
      newTrack = _.find(this.state.playlist.tracks, function(playlistTrack, index){
        if ( playlistTrack.id === track.id ) {
          newIndex = index;
          return true;
        }
      });
      this.playedIndices.push(this.state.index);
    }

    this.stopPreviousTrack();

    this.setState({
      track: newTrack,
      index: newIndex,
      audio: new Audio(APIUtils.getStreamUrl(newTrack))
    }, this.transitionToNewTrack);
  },

  setPlaylist: function(newPlaylist, cb) {
    cb = cb || function() {};

    if ( !newPlaylist.tracks ) {
      newPlaylist = {
        tracks: newPlaylist
      };
    }

    this.setState({
      playlist: newPlaylist,
      index: 0
    }, cb);
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