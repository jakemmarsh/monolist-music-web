'use strict';

import request  from 'superagent';

import APIUtils from './APIUtils';

const awsAPI = {

  uploadImage(type, image, id, progressCb = () => {}) {
    return new Promise((resolve, reject) => {
      request.post(APIUtils.root + 'upload/' + type + '/' + id)
      .withCredentials()
      .on('progress', progressCb)
      .attach('image', image)
      .end((err, res) => {
        if ( err || !res.ok || res.body.errors ) {
          reject(APIUtils.normalizeResponse(res.body.error || err));
        } else {
          resolve(APIUtils.normalizeResponse(res.body.data || res.body));
        }
      });
    });
  },

  uploadUserImage(image, userId) {
    return this.uploadImage('user', image, userId);
  },

  uploadPlaylistImage(image, playlistId) {
    return this.uploadImage('playlist', image, playlistId);
  },

  uploadGroupImage(image, groupId) {
    return this.uploadImage('group', image, groupId);
  }

};

export default awsAPI;
