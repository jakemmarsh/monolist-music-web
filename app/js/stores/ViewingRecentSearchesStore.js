'use strict';

import Reflux        from 'reflux';

import GlobalActions from '../actions/GlobalActions';
import PlaylistAPI   from '../utils/PlaylistAPI';

var ViewingRecentSearchesStore = Reflux.createStore({

  init() {
    this.searches = null;

    this.listenTo(GlobalActions.loadExploreSearches, this.loadRecentPlaylistSearches);
  },

  loadRecentPlaylistSearches(cb = function() {}) {
    PlaylistAPI.getRecentSearches().then((searches) => {
      this.searches = searches;
      cb(null, this.searches);
      this.trigger(null, this.searches);
    }).catch((err) => {
      cb(err);
      this.trigger(err);
    });
  }

});

export default ViewingRecentSearchesStore;