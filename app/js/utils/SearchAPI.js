'use strict';

import lscache  from 'lscache';

import APIUtils from './APIUtils';

const CACHE_TIME_IN_MINUTES = 10;

var SearchAPI = {

  trackSearch(query, sources) {
    return new Promise((resolve, reject) => {
      if ( sources && sources.length ) {
        sources = sources.join(',');
      } else {
        sources = 'soundcloud,youtube,bandcamp';
      }

      const key = `trackSearch:${query}:${sources}`;
      const cached = lscache.get(key);

      if ( cached ) {
        resolve(cached);
      } else {
        APIUtils.get(`tracks/search/${encodeURIComponent(query)}?sources=${sources}`).then((results) => {
          lscache.set(key, results, CACHE_TIME_IN_MINUTES);
          resolve(results);
        }).catch((err) => {
          reject(err);
        });
      }
    });
  },

  userSearch(query) {
    return new Promise((resolve, reject) => {
      const key = `userSearch:${query}`;
      const cached = lscache.get(key);

      if ( cached ) {
        resolve(cached);
      } else {
        APIUtils.get(`users/search/${encodeURIComponent(query)}`).then((results) => {
          lscache.set(key, results, CACHE_TIME_IN_MINUTES);
          resolve(results);
        }).catch((err) => {
          reject(err);
        });
      }
    });
  },

  playlistSearch(query) {
    return new Promise((resolve, reject) => {
      const key = `playlistSearch:${query}`;
      const cached = lscache.get(key);

      if ( cached ) {
        resolve(cached);
      } else {
        APIUtils.get(`playlists/search/${encodeURIComponent(query)}`).then((results) => {
          lscache.set(key, results, CACHE_TIME_IN_MINUTES);
          resolve(results);
        }).catch((err) => {
          reject(err);
        });
      }
    });
  },

  groupSearch(query) {
    return new Promise((resolve, reject) => {
      const key = `groupSearch:${query}`;
      const cached = lscache.get(key);

      if ( cached ) {
        resolve(cached);
      } else {
        APIUtils.get(`groups/search/${encodeURIComponent(query)}`).then((results) => {
          lscache.set(key, results, CACHE_TIME_IN_MINUTES);
          resolve(results);
        }).catch((err) => {
          reject(err);
        });
      }
    });
  }

};

export default SearchAPI;