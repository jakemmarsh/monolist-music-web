'use strict';

var Reflux        = require('reflux');

var GlobalActions = require('../actions/GlobalActions');
var SearchAPI     = require('../utils/SearchAPI');

var TrackSearchStore = Reflux.createStore({

  init: function() {
    this.listenTo(GlobalActions.doTrackSearch, this.doSearch);
  },

  doSearch: function(query, sources, cb) {
    cb = cb || function() {};

    console.log('search tracks:', query, sources);

    SearchAPI.trackSearch(query, sources).then(function(results) {
      this.results = results;
      cb(null, results);
      this.trigger(this.results);
    }).catch(function(err) {
      cb(err);
      this.results = null;
      this.trigger(null);
    });
  }

});

module.exports = TrackSearchStore;