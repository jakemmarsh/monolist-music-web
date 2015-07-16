'use strict';

import Reflux          from 'reflux';
import _               from 'lodash';

import PlaylistActions from '../actions/PlaylistActions';
import PlaylistAPI     from '../utils/PlaylistAPI';

var CurrentPlaylistStore = Reflux.createStore({

  init() {
    this.playlist = null;

    this.listenTo(PlaylistActions.play, this.selectPlaylist);
  },

  selectPlaylist(playlist, cb = function() {}) {
    console.log('select playlist:', playlist);

    // Only record a play if selected playlist is new
    if ( playlist.id && (_.isEmpty(this.playlist) || playlist.id !== this.playlist.id) ) {
      PlaylistAPI.recordPlay(playlist.id);
    }

    this.playlist = playlist;
    cb();

    this.trigger(playlist);
  }

});

export default CurrentPlaylistStore;