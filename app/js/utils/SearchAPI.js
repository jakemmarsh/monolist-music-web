'use strict';

import APIUtils from './APIUtils';

var SearchAPI = {

  trackSearch(query, sources) {
    if ( sources && sources.length ) {
      sources = sources.join(',');
    } else {
      sources = 'soundcloud,youtube,bandcamp';
    }

    return APIUtils.get('tracks/search/' + query + '?sources=' + sources);
  },

  userSearch(query) {
    return APIUtils.get('users/search/' + query);
  },

  playlistSearch(query) {
    return APIUtils.get('playlists/search/' + query);
  }

};

export default SearchAPI;