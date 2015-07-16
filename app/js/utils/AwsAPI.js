'use strict';

import request  from 'superagent';

import APIUtils from './APIUtils';

var awsAPI = {

  uploadUserImage(image, userId) {
    return new Promise((resolve, reject) => {
      request.post(APIUtils.root + 'upload/user/' + userId)
      .attach('image', image)
      .end(res => {
        if ( !res.ok ) {
          reject(APIUtils.normalizeResponse(res));
        } else {
          resolve(APIUtils.normalizeResponse(res));
        }
      });
    });
  },

  uploadPlaylistImage(image, playlistId) {
    return new Promise((resolve, reject) => {
      request.post(APIUtils.root + 'upload/playlist/' + playlistId)
      .attach('image', image)
      .end(res => {
        if ( !res.ok ) {
          reject(APIUtils.normalizeResponse(res));
        } else {
          resolve(APIUtils.normalizeResponse(res));
        }
      });
    });
  }

};

export default awsAPI;