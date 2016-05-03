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
  }

});

export default CurrentPlaylistStore;
