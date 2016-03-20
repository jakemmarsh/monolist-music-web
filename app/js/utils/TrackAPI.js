'use strict';

import APIUtils from './APIUtils';

var TrackAPI = {

  getTrackDetails(source, url) {
    return new Promise((resolve, reject) => {
      APIUtils.get(`details/${source}/${encodeURIComponent(url)}`).then((details) => {
        resolve(details);
      }).catch((err) => {
        reject(err);
      });
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