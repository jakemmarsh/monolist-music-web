'use strict';

import Reflux           from 'reflux';
import _                from 'lodash';

import PlaylistActions  from '../actions/PlaylistActions';
import PlaylistAPI      from '../utils/PlaylistAPI';
import Mixpanel         from '../utils/Mixpanel';

const CurrentPlaylistStore = Reflux.createStore({

  init() {
    this.playlist = null;

    this.listenTo(PlaylistActions.play, this.selectPlaylist);
    this.listenTo(PlaylistActions.removeTrack, this.removeTrack);
  },

  selectPlaylist(playlist, cb = function() {}) {
    // Only record a play if selected playlist is new
    if ( playlist.id && (_.isEmpty(this.playlist) || playlist.id !== this.playlist.id) ) {
      PlaylistAPI.recordPlay(playlist.id);
      Mixpanel.logEvent('play playlist', {
        playlist: playlist
      });
    }

    this.playlist = playlist;

    cb(this.playlist);
    this.trigger(this.playlist);
  },

  removeTrack(playlist, track) {
    if ( this.playlist && playlist.id === this.playlist.id ) {
      PlaylistAPI.removeTrack(playlist.id, track.id).then(() => {
        Mixpanel.logEvent('remove track', {
          playlistId: playlist.id,
          trackId: track.id
        });

        this.playlist.tracks = _.reject(this.playlist.tracks, (playlistTrack) => {
          return playlistTrack.id === track.id;
        });

        this.trigger(null, this.playlist);
      });
    }
  }

});

export default CurrentPlaylistStore;
