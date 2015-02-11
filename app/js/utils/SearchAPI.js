'use strict';

var APIUtils = require('./APIUtils');

var SearchAPI = {

  trackSearch: function(query, sources) {
    if ( sources && sources.length ) {
      sources = sources.join(',');
    } else {
      sources = 'soundcloud,youtube,bandcamp';
    }

    return APIUtils.get('track/search/' + query + '?sources=' + sources);
  },

  userSearch: function(query) {
    return APIUtils.get('user/search/' + query);
  },

  playlistSearch: function(query) {
    return APIUtils.get('playlist/search/' + query);
  }

};

module.exports = SearchAPI;