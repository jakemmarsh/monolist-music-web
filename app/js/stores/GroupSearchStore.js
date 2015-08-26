'use strict';

import Reflux        from 'reflux';

import SearchActions from '../actions/SearchActions';
import SearchAPI     from '../utils/SearchAPI';

var GroupSearchStore = Reflux.createStore({

  init() {
    this.results = null;
    this.listenTo(SearchActions.searchGroups, this.searchGroups);
  },

  searchGroups(query, cb = function(){}) {
    console.log('search groups for:', query);

    if ( query && query.length ) {
      SearchAPI.groupSearch(query).then(results => {
        this.results = results || [];
        cb(null, this.results);
        this.trigger(null, this.results);
      }).catch(err => {
        cb(err);
        this.trigger(err);
      });
    } else {
      this.results = null;
      cb(null, this.results);
      this.trigger(null, this.results);
    }
  }

});

export default GroupSearchStore;