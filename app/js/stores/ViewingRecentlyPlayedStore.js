'use strict';

import Reflux        from 'reflux';

import GlobalActions from '../actions/GlobalActions';
import PlaylistAPI   from '../utils/PlaylistAPI';

const ViewingRecentlyPlayedStore = Reflux.createStore({

  init() {
    this.playlists = null;

    this.listenTo(GlobalActions.loadExploreRecentlyPlayed, this.loadRecentlyPlayed);
  },

  loadRecentlyPlayed(cb = function() {}) {
    PlaylistAPI.getRecentlyPlayed().then((playlists) => {
      this.playlists = playlists;
      cb(null, this.playlists);
      this.trigger(null, this.playlists);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  }

});

export default ViewingRecentlyPlayedStore;
