'use strict';

import lscache  from 'lscache';

import APIUtils from './APIUtils';

const CACHE_TIME_IN_MINUTES = 120;

var TrackAPI = {

  getTrackDetails(source, url) {
    return new Promise((resolve, reject) => {
      const key = `trackDetails:${source}:${url}`;
      const cached = lscache.get(key);

      if ( cached ) {
        resolve(cached);
      } else {
        APIUtils.get(`details/${source}/${encodeURIComponent(url)}`).then((details) => {
          lscache.set(key, details, CACHE_TIME_IN_MINUTES);
          resolve(details);
        }).catch((err) => {
          reject(err);
        });
      }
    });
  },

  star(track) {
    return APIUtils.post('track/star', track);
  },

  upvote(trackId) {
    return APIUtils.post('track/' + trackId + '/upvote');
  },

  downvote(trackId) {
    return APIUtils.post('track/' + trackId + '/downvote');
  },

  addComment(trackId, comment) {
    comment = (typeof comment === 'object') ? comment : { body: comment };
    return APIUtils.post('track/' + trackId + '/comment', comment);
  },

  removeComment(trackId, commentId) {
    return APIUtils.del('track/' + trackId + '/comment/' + commentId);
  }

};

export default TrackAPI;