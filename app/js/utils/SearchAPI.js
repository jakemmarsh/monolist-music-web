'use strict';

import APIUtils from './APIUtils';

var SearchAPI = {

  trackSearch(query, sources) {
    if ( sources && sources.length ) {
      sources = sources.join(',');
    } else {
      sources = 'soundcloud,youtube,bandcamp';
    }

    return APIUtils.get(`tracks/search/${encodeURIComponent(query)}?sources=${sources}`);
  },

  userSearch(query) {
    return APIUtils.get(`users/search/${encodeURIComponent(query)}`);
  },

  playlistSearch(query) {
    return APIUtils.get(`playlists/search/${encodeURIComponent(query)}`);
  },

  groupSearch(query) {
    return APIUtils.get(`groups/search/${encodeURIComponent(query)}`);
  }

};

export default SearchAPI;