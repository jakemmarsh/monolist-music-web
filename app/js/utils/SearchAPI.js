'use strict';

import APIUtils from './APIUtils';

var SearchAPI = {

  trackSearch(query, sources) {
    return new Promise((resolve, reject) => {
      if ( sources && sources.length ) {
        sources = sources.join(',');
      } else {
        sources = 'soundcloud,youtube,bandcamp';
      }

      APIUtils.get(`tracks/search/${encodeURIComponent(query)}?sources=${sources}`).then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  userSearch(query) {
    return new Promise((resolve, reject) => {
      APIUtils.get(`users/search/${encodeURIComponent(query)}`).then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  playlistSearch(query) {
    return new Promise((resolve, reject) => {
      APIUtils.get(`playlists/search/${encodeURIComponent(query)}`).then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  },

  groupSearch(query) {
    return new Promise((resolve, reject) => {
      APIUtils.get(`groups/search/${encodeURIComponent(query)}`).then((results) => {
        resolve(results);
      }).catch((err) => {
        reject(err);
      });
    });
  }

};

export default SearchAPI;