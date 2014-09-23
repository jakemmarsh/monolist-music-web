'use strict';

var _        = require('underscore');

var APIUtils = require('../utils/APIUtils');

var PlayerControlsMixin = {

  playedIndices: [],

  getInitialState: function() {
    return {
      currentIndex: 0,
      isPlaying: false,
      repeat: false,
      shuffle: false,
      volume: 0.7,
      currentTime: 0,
      duration: 0,
      currentAudio: null
    };
  },

  componentWillMount: function() {
    this.setState({
      currentTrack: this.state.playlist[this.state.currentIndex],
      currentAudio: new Audio(this.state.playlist[this.state.currentIndex].url)
    });
  },

  componentDidMount: function() {
    this.addTrackListeners();
  },

  componentWillUnmount: function() {
    this.removeTrackListeners();
  },

  addTrackListeners: function() {
    this.state.currentAudio.volume = this.state.volume;
    this.state.currentAudio.addEventListener('ended', this.nextTrack);
    this.state.currentAudio.addEventListener('timeupdate', this.updateProgress);
    this.state.currentAudio.addEventListener('loadedmetadata', this.setDuration);
  },

  removeTrackListeners: function() {
    this.state.currentAudio.removeEventListener('ended', this.nextTrack);
    this.state.currentAudio.removeEventListener('timeupdate', this.updateProgress);
    this.state.currentAudio.removeEventListener('loadedmetadata', this.setDuration);
  },

  setDuration: function() {
    this.setState({
      duration: this.state.currentAudio.duration
    });
  },

  updateProgress: function() {
    this.setState({
      currentTime: this.state.currentAudio.currentTime
    });
  },

  seekTrack: function(newTime) {
    this.setState({
      currentTime: newTime
    }, function() {
      this.state.currentAudio.currentTime = this.state.currentTime;
    });
  },

  updateVolume: function(newVolume) {
    this.setState({
      volume: newVolume
    }, function() {
      this.state.currentAudio.volume = this.state.volume;
    });
  },

  getRandomTrackIndex: function() {
    var index = Math.floor((Math.random() * this.state.playlist.length - 1) + 1);

    // Recurse until we're not playing the same or last track
    if ( index === this.state.currentIndex || index === this.playedIndices[this.playedIndices.length - 1] ) {
      return this.getRandomTrackIndex();
    }

    return index;
  },

  stopPreviousTrack: function() {
    this.state.currentAudio.pause();
    this.removeTrackListeners();
  },

  transitionToNewTrack: function() {
    this.addTrackListeners();
    this.state.currentAudio.play();
  },

  lastTrack: function() {
    var newIndex;

    if ( this.state.shuffle) {
      newIndex = this.playedIndices.pop();
    } else {
      newIndex = ( this.state.currentIndex - 1 > -1 ) ? this.state.currentIndex - 1 : 0;
    }

    this.stopPreviousTrack();

    this.setState({
      currentIndex: newIndex,
      currentTrack: this.state.playlist[newIndex],
      currentAudio: new Audio(this.state.playlist[newIndex].url)
    }, this.transitionToNewTrack);
  },

  nextTrack: function() {
    var newIndex = null;

    if ( this.state.shuffle ) {
      // Only loop back if user has 'repeat' toggled
      if ( this.state.repeat ) {
        newIndex = this.getRandomTrackIndex();
      } else {
        newIndex = ( this.playedIndices.length < this.state.playlist.length ) ? this.getRandomTrackIndex() : null;
      }
    } else {
      newIndex = this.state.currentIndex + 1;

      // Only loop back if user has 'repeat' toggled
      if ( newIndex > this.state.playlist.length - 1 ) {
        if ( this.state.repeat ) {
          newIndex = 0;
        } else {
          newIndex = null;
        }
      }
    }

    this.stopPreviousTrack();

    if ( newIndex !== null ) {
      this.playedIndices.push(this.state.currentIndex);
      this.setState({
        currentIndex: newIndex,
        currentTrack: this.state.playlist[newIndex],
        currentAudio: new Audio(this.state.playlist[newIndex].url)
      }, this.transitionToNewTrack);
    }
  },

  selectTrack: function(track, source) {
    var newTrack;
    var newIndex;


    // Play song directly if from search page,
    // ignoring playlist logic
    if ( source === 'search' ) {
      this.stopPreviousTrack();

      this.setState({
        currentTrack: track,
        currentAudio: new Audio(APIUtils.getStreamUrl(track))
      }, this.transitionToNewTrack);
    } else if ( source === 'playlist' ) {
      _.each(this.state.playlist, function(playlistTrack, index){
        if ( playlistTrack.id === track.id ) {
          newTrack = playlistTrack;
          newIndex = index;
        }
      });

      this.playedIndices.push(this.state.currentIndex);
      this.stopPreviousTrack();

      this.setState({
        currentTrack: newTrack,
        currentIndex: newIndex,
        currentAudio: new Audio(newTrack.url)
      }, this.transitionToNewTrack);
    }
  },

  togglePlay: function() {
    this.setState({
      isPlaying: !this.state.isPlaying
    }, function() {
      if ( this.state.isPlaying ) {
        this.state.currentAudio.play();
      } else {
        this.state.currentAudio.pause();
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