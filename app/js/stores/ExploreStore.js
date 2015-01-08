'use strict';

var Reflux        = require('reflux');
var when          = require('when');

var GlobalActions = require('../actions/GlobalActions');
var ExploreAPI    = require('../utils/ExploreAPI');

var ExploreStore = Reflux.createStore({

  init: function() {
    this.playlists = null;

    this.listenTo(GlobalActions.loadExplorePlaylists, this.loadPlaylists);
  },

  loadPlaylists: function(cb) {
    cb = cb || function() {};

    console.log('load explore playlists');

    when.all([
      ExploreAPI.getTrending(),
      ExploreAPI.getNewest()
    ]).then(function(results) {
      this.playlists = {
        trending: results[0],
        newest: results[1]
      };
      cb(null, this.playlists);
      this.trigger(null, this.playlists);
    }.bind(this)).catch(function(err) {
      cb(err);
      this.trigger(err);
    }.bind(this));
  }

});

module.exports = ExploreStore;