'use strict';

import Reflux        from 'reflux';

import SearchActions from '../actions/SearchActions';
import SearchAPI     from '../utils/SearchAPI';

var TrackSearchStore = Reflux.createStore({

  init() {
    this.results = null;

    this.listenTo(SearchActions.searchTracks, this.doSearch);
  },

  doSearch(query, sources, cb = function() {}) {
    console.log('search tracks:', query, sources);

    SearchAPI.trackSearch(query, sources).then(results => {
      this.results = results || [];
      cb(null, this.results);
      this.trigger(null, this.results);
    }).catch(err => {
      cb(err);
      this.results = null;
      this.trigger(err, null);
    });
  }

});

export default TrackSearchStore;