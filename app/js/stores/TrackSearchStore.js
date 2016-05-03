'use strict';

import Reflux        from 'reflux';

import SearchActions from '../actions/SearchActions';
import SearchAPI     from '../utils/SearchAPI';
import Mixpanel      from '../utils/Mixpanel';

const TrackSearchStore = Reflux.createStore({

  init() {
    this.results = null;

    this.listenTo(SearchActions.searchTracks, this.doSearch);
  },

  doSearch(query, sources, cb = function() {}) {
    SearchAPI.trackSearch(query, sources).then((results) => {
      this.results = results || [];
      Mixpanel.logEvent('search tracks', {
        query: query,
        sources: sources,
        numResults: results.length
      });

      cb(null, this.results);
      this.trigger(null, this.results);
    }).catch((err) => {
      cb(err);
    });
  }

});

export default TrackSearchStore;
