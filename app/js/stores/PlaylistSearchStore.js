'use strict';

import Reflux        from 'reflux';

import SearchActions from '../actions/SearchActions';
import SearchAPI     from '../utils/SearchAPI';
import Mixpanel      from '../utils/Mixpanel';

const PlaylistSearchStore = Reflux.createStore({

  init() {
    this.results = null;

    this.listenTo(SearchActions.searchPlaylists, this.doSearch);
  },

  doSearch(query, cb = function() {}) {
    SearchAPI.playlistSearch(query).then((results) => {
      this.results = results || [];
      Mixpanel.logEvent('search playlists', {
        query: query,
        numResults: this.results.length
      });

      cb(null, this.results);
      this.trigger(null, this.results);
    }).catch((err) => {
      this.results = null;
      cb(err);
      this.trigger(err);
    });
  }

});

export default PlaylistSearchStore;
