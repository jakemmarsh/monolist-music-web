/* global YT */
'use strict';

import Audio5js             from '../../../node_modules/audio5/audio5';

import $                    from 'jquery';
import _                    from 'lodash';

import CurrentTrackStore    from '../stores/CurrentTrackStore';
import TrackActions         from '../actions/TrackActions';
import CurrentPlaylistStore from '../stores/CurrentPlaylistStore';
import APIUtils             from '../utils/APIUtils';

var PlayerControlsMixin = {

  playedIndices: [],

  player: null,

  audio: null,

  ytPlayer: null,

  getInitialState() {
    return {
      queue: [],
      index: -1,
      repeat: false,
      shuffle: false,
      volume: 0.7,
      time: 0,
      duration: 0,
      paused: true,
      track: null,
      error: null
    };
  },

  componentDidMount() {
    $(document).keydown(this.handleGlobalKeyPress);
    this.listenTo(CurrentTrackStore, this.selectTrack);
    this.listenTo(CurrentPlaylistStore, this.selectPlaylist);
    this.initPlayer();
  },

  componentWillUnmount() {
    // Attempt to destroy HTML5 player
    if ( !_.isEmpty(this.player) ) { try { this.player.destroy(); } catch(e) {} }
    // Attempt to destroy YouTube player
    if ( !_.isEmpty(this.ytPlayer) ) { try { this.ytPlayer.destroy(); } catch(e) {} }
  },

  handleGlobalKeyPress(evt) {
    let keyCode = evt.keyCode || evt.which;
    let $focusedElement = $(':focus');
    let isInInput = $focusedElement.is('textarea') || $focusedElement.is('input');
    let isControlKey = (keyCode === 32 || keyCode === 37 || keyCode === 39);

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

  initPlayer() {
    let component = this;

    this.player = new Audio5js({
      swf_path: 'node_modules/audio5/swf/audio5js.swf',
      codecs: ['mp3', 'mp4', 'wav', 'webm'],
      use_flash: true,
      format_time: false,
      ready: function() {
        this.on('timeupdate', component.updateProgress);
        this.on('error', error => { console.log('player error:', error); });
        this.on('ended', component.nextTrack);
        this.audio.volume(component.state.volume);
      }
    });
    this.audio = this.player.audio;
  },

  initYtPlayer(videoId) {
    let component = this;

    this.ytPlayer = new YT.Player('yt-player', {
      height: '100',
      width: '150',
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        disablekb: 1,
        fs: 0,
        showinfo: 0,
        autohide: 1,
        iv_load_policy: 3
      },
      events: {
        onReady: function(evt) {
          evt.target.setVolume(component.state.volume * 100);
        },
        onStateChange: function(evt) {
          if ( evt.data === YT.PlayerState.ENDED ) {
            component.nextTrack();
          } else if ( evt.data === YT.PlayerState.PAUSED && component.state.paused !== true ) {
            component.setState({ paused: true });
          } else if ( evt.data === YT.PlayerState.PLAYING && component.state.paused !== false ) {
            component.setState({ paused: false });
          }
        }
      }
    });
  },

  updateProgress(position) {
    if ( this.state.track && this.state.track.source === 'youtube' ) {
      position = this.ytPlayer.getCurrentTime ? this.ytPlayer.getCurrentTime() : 0;
    }

    if ( !isNaN(position) ) {
      this.setState({ time: position });
    }
  },

  seekTrack(newTime = 0) {
    this.setState({ time: newTime }, () => {
      if (this.state.track.source === 'youtube' ) {
        this.ytPlayer.seekTo(newTime);
      } else {
        this.player.seek(newTime);
      }
    });
  },

  updateVolume(newVolume = 0.7) {
    this.setState({ volume: newVolume }, () => {
      if ( this.state.track.source === 'youtube' ) {
        this.ytPlayer.setVolume(newVolume * 100);
      } else {
        this.audio.volume(newVolume);
      }
    });
  },

  getRandomTrackIndex() {
    let index = Math.floor((Math.random() * this.state.playlist.tracks.length - 1) + 1);

    // Recurse until we're not playing the same or previous track
    if ( index === this.state.index || index === this.playedIndices[this.playedIndices.length - 1] ) {
      return this.getRandomTrackIndex();
    }

    return index;
  },

  getPreviousTrackIndex() {
    let index = this.playedIndices.pop();
    let atTopOfPlaylist = this.state.index - 1 < 0;

    if ( typeof index === undefined ) {
      if ( atTopOfPlaylist ) {
        index = this.state.repeat ? this.state.playlist.tracks.length - 1 : -1;
      } else {
        index = null;
      }
    }

    return index;
  },

  getNextTrackIndex() {
    let index = null;

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

  transitionToNewTrack() {
    let progressInterval;

    if ( this.state.track ) {
      if ( this.state.track.source === 'youtube' ) {
        if ( _.isEmpty(this.ytPlayer) ) {
          this.initYtPlayer(this.state.track.sourceParam);
        } else {
          this.ytPlayer.loadVideoById(this.state.track.sourceParam);
        }
        this.setState({ paused: false });
        progressInterval = setInterval(this.updateProgress, 500);
      } else {
        this.player.load(APIUtils.getStreamUrl(this.state.track));
        this.playTrack();
        clearInterval(progressInterval);
      }
    }
  },

  previousTrack() {
    let newIndex;

    if ( !_.isEmpty(this.state.playlist) ) {
      // If past the beginning of a song, just rewind
      if ( this.audio.position > 20 ) {
        this.seekTrack(0);
      } else {
        newIndex = this.getPreviousTrackIndex();

        this.pauseTrack(() => {
          this.setState({
            track: ( newIndex !== null ) ? this.state.playlist.tracks[newIndex] : null,
            index: ( newIndex !== null ) ? newIndex : -1
          }, this.transitionToNewTrack);
        });
      }
    }
  },

  nextTrack() {
    let newTrack = null;
    let newIndex;
    let queueCopy;

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

  selectTrack(track, index) {
    this.playedIndices.push(this.state.index);

    this.pauseTrack(() => {
      this.setState({
        track: track,
        index: index,
        time: 0,
        duration: !_.isEmpty(track) ? track.duration : 0
      }, this.transitionToNewTrack);
    });
  },

  selectPlaylist(newPlaylist) {
    let isSamePlaylist = this.state.playlist && this.state.playlist.id === newPlaylist.id;

    // Ensure structure is correct
    if ( !newPlaylist.tracks ) {
      newPlaylist = {
        tracks: newPlaylist
      };
    }

    this.setState({
      playlist: newPlaylist,
      index: isSamePlaylist ? this.state.index : -1
    }, () => {
      this.playedIndices = [];
    });
  },

  queueTrack(track) {
    let queueCopy = this.state.queue.slice();

    queueCopy.push(track);

    this.setState({ queue: queueCopy });
  },

  pauseTrack(cb = function(){}) {
    this.setState({ paused: true }, () => {
      if ( this.state.track ) {
        if ( this.state.track.source === 'youtube' ) {
          this.ytPlayer.pauseVideo();
        } else {
          this.audio.pause();
        }
      }
      cb();
    });
  },

  playTrack() {
    if ( this.state.track ) {
      this.setState({ paused: false }, () => {
        if ( this.state.track.source === 'youtube' ) {
          this.ytPlayer.playVideo();
        } else {
          this.player.play();
        }
      });
    }
  },

  togglePlay() {
    if ( !this.state.track && !_.isEmpty(this.state.playlist) ) {
      this.nextTrack();
    }

    if ( this.state.paused ) {
      this.playTrack();
    } else {
      this.pauseTrack();
    }
  },

  toggleRepeat() {
    this.setState({ repeat: !this.state.repeat });
  },

  toggleShuffle() {
    this.setState({ shuffle: !this.state.shuffle });
  }

};

export default PlayerControlsMixin;