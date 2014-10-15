'use strict';

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
      time: this.state.audio.currentTime
    });
  },

  seekTrack: function(newTime) {
    // TODO: fix to work with YouTube tracks
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

  getLastTrackIndex: function() {
    var index = this.playedIndices.pop();
    var atTopOfPlaylist = this.state.index - 1 < 0;

    if ( typeof index === undefined ) {
      if ( atTopOfPlaylist ) {
        index = this.state.repeat ? this.state.playlist.tracks.length - 1 : -1;
      } else {
        index = null;
      }
    }

    return index;
  },

  getNextTrackIndex: function() {
    var index = null;

    if ( this.state.shuffle && !this.state.trackQueued ) {
      // Only loop back if user has 'repeat' toggled
      if ( this.state.repeat ) {
        index = this.getRandomTrackIndex();
      } else {
        index = ( this.playedIndices.length < this.state.playlist.tracks.length ) ? this.getRandomTrackIndex() : null;
      }
    } else {
      index = this.state.index + 1;

      // Only loop back if user has 'repeat' toggled
      if ( index > this.state.playlist.tracks.length - 1 ) {
        if ( this.state.repeat ) {
          index = 0;
        } else {
          index = null;
        }
      }
    }

    return index;
  },

  stopPreviousTrack: function() {
    this.state.audio.pause();
    this.removeTrackListeners();
  },

  transitionToNewTrack: function() {
    if ( this.state.track ) {
      this.state.audio.setAttribute('src', APIUtils.getStreamUrl(this.state.track));

      this.addTrackListeners();

      // if duration is passed via API and not on audio object
      if ( this.state.track.duration ) {
        // TODO: better fix for this, __defineGetter__ is deprecated
        this.state.audio.__defineGetter__('duration', function() {
          return this.state.track.duration;
        }.bind(this));
      }

      // TODO: don't auto-play if paused and "next" button is clicked
      this.state.audio.play();
    }
  },

  lastTrack: function() {
    var newIndex;

    // If past the beginning of a song, just rewind
    if ( this.state.audio.currentTime > 20 ) {
      this.state.audio.currentTime = 0;
    } else {
      newIndex = this.getLastTrackIndex();

      this.stopPreviousTrack();

      this.setState({
        track: ( newIndex !== null ) ? this.state.playlist.tracks[newIndex] : null,
        index: ( newIndex !== null ) ? newIndex : -1
      }, this.transitionToNewTrack);
    }
  },

  nextTrack: function() {
    var newIndex = this.getNextTrackIndex();
    var newTrack = null;

    this.stopPreviousTrack();

    if ( newIndex === null ) {
      newIndex = -1;
      this.state.audio.setAttribute('src', '');
    } else {
      newTrack = this.state.playlist.tracks[newIndex];
    }

    this.selectTrack(newTrack, newIndex);
  },

  selectTrack: function(track, index) {
    this.playedIndices.push(this.state.index);

    this.stopPreviousTrack();

    this.setState({
      track: track,
      index: index,
      trackQueued: false
    }, this.transitionToNewTrack);
  },

  selectPlaylist: function(newPlaylist, cb) {
    cb = cb || function() {};

    // Ensure structure is correct
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

  queueTrack: function(track) {
    var playlistCopy = this.state.playlist.slice();

    // place new track in next spot of playlist
    playlistCopy.splice(this.state.index + 1, 0, track);

    this.setState({
      playlist: playlistCopy,
      trackQueued: true
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