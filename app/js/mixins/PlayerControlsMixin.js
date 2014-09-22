'use strict';

var _ = require('underscore');

var PlayerControlsMixin = {

  getInitialState: function() {
    return {
      currentIndex: 0,
      isPlaying: false,
      repeat: false,
      shuffle: false
    };
  },

  componentWillMount: function() {
    this.setState({
      currentTrack: this.state.playlist[this.state.currentIndex]
    });
  },

  lastTrack: function() {
    var newIndex = ( this.state.currentIndex - 1 > -1 ) ? this.state.currentIndex - 1 : this.state.playlist.length - 1;

    this.setState({
      currentIndex: newIndex,
      currentTrack: this.state.playlist[newIndex]
    });
  },

  nextTrack: function() {
    var newIndex = ( this.state.currentIndex + 1 < this.state.playlist.length ) ? this.state.currentIndex + 1 : 0;

    this.setState({
      currentIndex: newIndex,
      currentTrack: this.state.playlist[newIndex]
    }, function() {
    });
  },

  selectTrack: function(id) {
    var newTrack;
    var newIndex;

    _.each(this.state.playlist, function(track, index){
      if ( track.id === id ) {
        newTrack = track;
        newIndex = index;
      }
    });

    this.setState({
      currentTrack: newTrack,
      currentIndex: newIndex
    });
  },

  togglePlay: function() {
    this.setState({
      isPlaying: !this.state.isPlaying
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