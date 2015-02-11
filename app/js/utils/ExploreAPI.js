'use strict';

var APIUtils = require('./APIUtils');

var ExploreAPI = {

  getNewest: function() {
    return APIUtils.get('playlists/newest');
  },

  getTrending: function() {
    return APIUtils.get('playlists/trending');
  }

};

module.exports = ExploreAPI;