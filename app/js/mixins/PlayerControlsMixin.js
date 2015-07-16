'use strict';

var notifier              = require('../utils/Notifier');

import $                     from 'jquery';
import _                     from 'lodash';
import request               from 'superagent';

import CurrentTrackStore     from '../stores/CurrentTrackStore';
import TrackActions          from '../actions/TrackActions';
import CurrentPlaylistStore  from '../stores/CurrentPlaylistStore';
import APIUtils              from '../utils/APIUtils';

var PlayerControlsMixin = {

  playedIndices: [],

  mixins: [GlobalErrorModalMixin],

  getInitialState: function() {
    return {
      queue: [],
      index: -1,
      repeat: false,
      shuffle: false,
      volume: 0.7,
      time: 0,
      paused: true,
      audio: new audio5js({
        swf_path: '../swf/audio5js.swf',
        format_time: false
      }),
      track: null,
      error: null
    };
  },

  componentDidMount: function() {
    $(document).keydown(this.handleGlobalKeyPress);
    this.listenTo(CurrentTrackStore, this.selectTrack);
    this.listenTo(CurrentPlaylistStore, this.selectPlaylist);
    this.addTrackListeners();

    console.log('mp3:', audio5js.can_play('mp3'));
    console.log('vorbis:', audio5js.can_play('vorbis'));
    console.log('opus:', audio5js.can_play('opus'));
    console.log('webm:', audio5js.can_play('webm'));
    console.log('mp4:', audio5js.can_play('mp4'));
    console.log('wav:', audio5js.can_play('wav'));
  },

  componentWillUnmount: function() {
    this.state.audio.destroy();
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
          this.previousTrack();
          break;
        case 39: // Right arrow
          this.nextTrack();
          break;
      }
    }
  },

  addTrackListeners: function() {
    this.state.audio.volume = this.state.volume;
    this.state.audio.on('timeupdate', this.updateProgress);
    this.state.audio.on('ended', this.nextTrack);
    this.state.audio.on('error', this.handleSourceError);
  },

  handleSourceError: function(err) {
    switch (err.target.error.code) {
        case err.target.error.MEDIA_ERR_ABORTED:
            this.showGlobalErrorModal('You aborted the media playback.');
            break;
        case err.target.error.MEDIA_ERR_NETWORK:
            this.showGlobalErrorModal('A network error caused the media download to fail.');
            break;
        case err.target.error.MEDIA_ERR_DECODE:
            this.showGlobalErrorModal('The media playback was aborted due to a corruption problem or because the media used features your browser did not support.');
            break;
        case err.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            this.showGlobalErrorModal('The media could not be loaded, either because the server or network failed or because the format is not supported.');
            break;
        default:
            this.showGlobalErrorModal('An unknown media error occurred.');
    }
  },

  updateProgress: function() {
    this.setState({ time: this.state.audio.position });
  },

  seekTrack: function(newTime) {
    this.setState({ time: newTime }, function() {
      this.state.audio.seek(newTime);
    }.bind(this));
  },

  updateVolume: function(newVolume) {
    this.setState({ volume: newVolume }, function() {
      this.state.audio.volume = this.state.volume;
    });
  },

  getRandomTrackIndex: function() {
    var index = Math.floor((Math.random() * this.state.playlist.tracks.length - 1) + 1);

    // Recurse until we're not playing the same or previous track
    if ( index === this.state.index || index === this.playedIndices[this.playedIndices.length - 1] ) {
      return this.getRandomTrackIndex();
    }

    return index;
  },

  getPreviousTrackIndex: function() {
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

  transitionToNewTrack: function() {
    if ( this.state.track ) {
      this.state.audio.load(APIUtils.getStreamUrl(this.state.track));

      notifier.notify(this.state.track.title, this.state.track.artist, this.state.track.imageUrl);
    }

    this.playTrack();
  },

  previousTrack: function() {
    var newIndex;

    if ( !_.isEmpty(this.state.playlist) ) {
      // If past the beginning of a song, just rewind
      if ( this.state.audio.position > 20 ) {
        this.state.audio.position = 0;
      } else {
        newIndex = this.getPreviousTrackIndex();

        this.pauseTrack();

        this.setState({
          track: ( newIndex !== null ) ? this.state.playlist.tracks[newIndex] : null,
          index: ( newIndex !== null ) ? newIndex : -1
        }, this.transitionToNewTrack);
      }
    }
  },

  nextTrack: function() {
    var newTrack = null;
    var newIndex;
    var queueCopy;

    if ( !_.isEmpty(this.state.playlist) ) {
      newIndex = this.getNextTrackIndex();

        this.pauseTrack();

      if ( this.state.queue.length ) {
        queueCopy = this.state.queue.slice();
        newTrack = queueCopy.pop();
        newIndex = this.state.index;
        this.setState({
          queue: queueCopy
        });
      } else if ( newIndex === null ) {
        newIndex = -1;
      } else {
        newTrack = this.state.playlist.tracks[newIndex];
      }

      TrackActions.select(newTrack, newIndex);
    }
  },

  selectTrack: function(track, index) {
    this.playedIndices.push(this.state.index);

    this.pauseTrack();

    this.setState({
      track: track,
      index: index,
      time: 0
    }, this.transitionToNewTrack);
  },

  selectPlaylist: function(newPlaylist, cb) {
    var isSamePlaylist = this.state.playlist && this.state.playlist.id === newPlaylist.id;

    cb = cb || function() {};

    // Ensure structure is correct
    if ( !newPlaylist.tracks ) {
      newPlaylist = {
        tracks: newPlaylist
      };
    }

    this.setState({
      playlist: newPlaylist,
      index: isSamePlaylist ? this.state.index : -1
    }, function() {
      this.playedIndices = [];

      cb();
    });
  },

  queueTrack: function(track) {
    var queueCopy = this.state.queue.slice();

    queueCopy.push(track);

    this.setState({ queue: queueCopy });
  },

  pauseTrack: function() {
    if ( this.state.track ) {
      this.setState({ paused: true }, function() {
        this.state.audio.pause();
      }.bind(this));
    }
  },

  playTrack: function() {
    if ( this.state.track ) {
      this.setState({ paused: false }, function() {
        this.state.audio.play();
      }.bind(this));
    }
  },

  togglePlay: function() {
    if ( !this.state.track && !_.isEmpty(this.state.playlist) ) {
      this.nextTrack();
    }

    if ( this.state.paused ) {
      this.playTrack();
    } else {
      this.pauseTrack();
    }
  },

  toggleRepeat: function() {
    this.setState({ repeat: !this.state.repeat });
  },

  toggleShuffle: function() {
    this.setState({ shuffle: !this.state.shuffle });
  }

};

module.exports = PlayerControlsMixin;