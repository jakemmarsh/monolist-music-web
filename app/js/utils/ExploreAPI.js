'use strict';

import APIUtils from './APIUtils';

var ExploreAPI = {

  getNewest() {
    return APIUtils.get('playlists/newest');
  },

  getTrending() {
    return APIUtils.get('playlists/trending');
  }

};

export default ExploreAPI;