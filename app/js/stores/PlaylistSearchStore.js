'use strict';

import Reflux        from 'reflux';

import GlobalActions from '../actions/GlobalActions';
import SearchAPI     from '../utils/SearchAPI';

var PlaylistSearchStore = Reflux.createStore({

  init() {
    this.listenTo(GlobalActions.doPlaylistSearch, this.doSearch);
  },

  doSearch(query, cb = function() {}) {
    console.log('search playlists:', query);

    SearchAPI.playlistSearch(query).then(results => {
      this.results = results;
      cb(null, results);
      this.trigger(this.results);
    }).catch(err => {
      cb(err);
      this.results = null;
      this.trigger(null);
    });
  }

});

export default PlaylistSearchStore;