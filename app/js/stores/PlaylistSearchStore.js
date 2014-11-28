'use strict';

var Reflux        = require('reflux');

var GlobalActions = require('../actions/GlobalActions');
var SearchAPI     = require('../utils/SearchAPI');

var PlaylistSearchStore = Reflux.createStore({

  init: function() {
    this.listenTo(GlobalActions.doPlaylistSearch, this.doSearch);
  },

  doSearch: function(query, cb) {
    cb = cb || function() {};

    console.log('search playlists:', query);

    SearchAPI.playlistSearch(query).then(function(results) {
      this.results = results;
      cb(null, results);
      this.trigger(this.results);
    }.bind(this)).catch(function(err) {
      cb(err);
      this.results = null;
      this.trigger(null);
    }.bind(this));
  }

});

module.exports = PlaylistSearchStore;