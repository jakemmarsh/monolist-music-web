'use strict';

import Reflux        from 'reflux';

import SearchActions from '../actions/SearchActions';
import SearchAPI     from '../utils/SearchAPI';

var PlaylistSearchStore = Reflux.createStore({

  init() {
    this.results = null;

    this.listenTo(SearchActions.searchPlaylists, this.doSearch);
  },

  doSearch(query, cb = function() {}) {
    console.log('search playlists:', query);

    SearchAPI.playlistSearch(query).then(results => {
      this.results = results || [];
      cb(null, this.results);
      this.trigger(this.results);
    }).catch(err => {
      cb(err);
      this.results = null;
      this.trigger(null);
    });
  }

});

export default PlaylistSearchStore;